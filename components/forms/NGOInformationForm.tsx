'use client'

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { IoMdPerson, IoMdAdd, IoMdTrash } from "react-icons/io";
import { CldUploadWidget } from 'next-cloudinary';
import Image from "next/image";
import { createNGO, uploadImage } from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

// Define the requirements schema (ngoInfoSchema)
const ngoInfoSchema = z.object({
    name: z.string().min(1, { message: "NGO Name is required" }),
    type: z.string().optional(),
    registeredAddress: z.string().min(1, { message: "Registered Address is required" }),
    operationalAddress: z.string().min(1, { message: "Operational Address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    pincode: z.string().min(1, { message: "Pincode is required" }),
    officialEmail: z.string().email({ message: "Invalid email address" }),
    officialPhoneNumber: z.string().min(1, { message: "Official Phone Number is required" }),
    website: z.string().optional(),
    contactPersonName: z.string().min(1, { message: "Contact Person Name is required" }),
    contactPersonDesignation: z.string().min(1, { message: "Contact Person Designation is required" }),
    contactPersonEmail: z.string().email({ message: "Invalid contact person email" }),
    contactPersonPhoneNumber: z.string().min(1, { message: "Contact Person Phone Number is required" }),
    missionStatement: z.string().optional(),
    visionStatement: z.string().optional(),
    description: z.string().optional(),
    areaOfWork: z.string().optional(),
    ongoingProjects: z.array(z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        topDonators: z.string().optional(),
        allocatedBudget: z.string().optional(),
        numberOfVolunteers: z.string().optional(),
    })).optional(),
    annualBudget: z.string().optional(),
    numberOfVolunteers: z.string().optional(),
    awards: z.array(z.object({
        name: z.string().optional(),
        description: z.string().optional(),
    })).optional(),
    hasOngoingProjects: z.boolean().optional(),
    hasAwards: z.boolean().optional(),
}).superRefine((data, ctx) => {
    if (data.hasOngoingProjects) {
        if (!data.ongoingProjects || data.ongoingProjects.length === 0) {
            ctx.addIssue({
                path: ['ongoingProjects'],
                code: z.ZodIssueCode.custom,
                message: "At least one ongoing project is required",
            });
        } else {
            data.ongoingProjects.forEach((project, i) => {
                if (!project.name) {
                    ctx.addIssue({
                        path: ['ongoingProjects', i, 'name'],
                        code: z.ZodIssueCode.custom,
                        message: "Project name is required",
                    });
                }
                if (!project.description) {
                    ctx.addIssue({
                        path: ['ongoingProjects', i, 'description'],
                        code: z.ZodIssueCode.custom,
                        message: "Project description is required",
                    });
                }
            });
        }
    }
    if (data.hasAwards) {
        if (!data.awards || data.awards.length === 0) {
            ctx.addIssue({
                path: ['awards'],
                code: z.ZodIssueCode.custom,
                message: "At least one award is required",
            });
        } else {
            data.awards.forEach((award, i) => {
                if (!award.name) {
                    ctx.addIssue({
                        path: ['awards', i, 'name'],
                        code: z.ZodIssueCode.custom,
                        message: "Award name is required",
                    });
                }
                if (!award.description) {
                    ctx.addIssue({
                        path: ['awards', i, 'description'],
                        code: z.ZodIssueCode.custom,
                        message: "Award description is required",
                    });
                }
            });
        }
    }
});

// Define the taxation schema
const taxationSchema = z.object({
    registrationNumber: z.string().min(1, { message: "Registration Number is required" }),
    dateOfRegistration: z.string().min(1, { message: "Date of Registration is required" }),
    panNumber: z.string().length(10, { message: "PAN must be 10 characters" }),
    taxExemptionRegistration: z.string().min(1, { message: "Tax Exemption Registration image is required" }),
    fcraRegistration: z.string().min(1, { message: "FCRA Registration image is required" }),
    registrationCertificate: z.string().min(1, { message: "Registration Certificate image is required" }),
});

type NGOInfoForm = z.infer<typeof ngoInfoSchema>;
type TaxationForm = z.infer<typeof taxationSchema>;

export default function NGOInformationForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const subStep = searchParams.get("subStep");

    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [ngoInfo, setNgoInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Choose schema and default values based on subStep
    const isTaxation = subStep === "taxation";
    const formSchema = isTaxation ? taxationSchema : ngoInfoSchema;

    const { register, control, handleSubmit, formState: { errors, isSubmitting }, setError, watch, setValue, reset } = useForm<any>({
        resolver: zodResolver(formSchema as any),
        defaultValues: isTaxation ? {
            registrationNumber: "",
            dateOfRegistration: "",
            panNumber: "",
            taxExemptionRegistration: "",
            fcraRegistration: "",
            registrationCertificate: "",
        } : {}
    });

    const fcraValue = watch("fcraRegistration");
    const taxExemptionValue = watch("taxExemptionRegistration");
    const registrationCertificateValue = watch("registrationCertificate");

    // get ngo info from local storage and set form values
    useEffect(() => {
        const storedNgoInfo = localStorage.getItem("ngoInfo");
        if (storedNgoInfo) {
            const parsedNgoInfo = JSON.parse(storedNgoInfo);
            setNgoInfo(parsedNgoInfo);
            setProfileImage(parsedNgoInfo.profileImage || null);

            if (!isTaxation) {
                // Reset form with stored values
                reset({
                    name: parsedNgoInfo.name || "",
                    type: parsedNgoInfo.type || "",
                    registeredAddress: parsedNgoInfo.registeredAddress || "",
                    operationalAddress: parsedNgoInfo.operationalAddress || "",
                    city: parsedNgoInfo.city || "",
                    state: parsedNgoInfo.state || "",
                    country: parsedNgoInfo.country || "",
                    pincode: parsedNgoInfo.pincode || "",
                    officialEmail: parsedNgoInfo.officialEmail || "",
                    officialPhoneNumber: parsedNgoInfo.officialPhoneNumber || "",
                    website: parsedNgoInfo.website || "",
                    contactPersonName: parsedNgoInfo.contactPersonName || "",
                    contactPersonDesignation: parsedNgoInfo.contactPersonDesignation || "",
                    contactPersonEmail: parsedNgoInfo.contactPersonEmail || "",
                    contactPersonPhoneNumber: parsedNgoInfo.contactPersonPhoneNumber || "",
                    missionStatement: parsedNgoInfo.missionStatement || "",
                    visionStatement: parsedNgoInfo.visionStatement || "",
                    description: parsedNgoInfo.description || "",
                    areaOfWork: parsedNgoInfo.areaOfWork || "",
                    ongoingProjects: parsedNgoInfo.ongoingProjects || [{ name: "", description: "", topDonators: "", allocatedBudget: "", numberOfVolunteers: "" }],
                    annualBudget: parsedNgoInfo.annualBudget || "",
                    numberOfVolunteers: parsedNgoInfo.numberOfVolunteers || "",
                    awards: parsedNgoInfo.awards || [{ name: "", description: "" }],
                    hasOngoingProjects: parsedNgoInfo.hasOngoingProjects || false,
                    hasAwards: parsedNgoInfo.hasAwards || false,
                });
            }
        } else {
            router.push("/auth/signup/ngo?redirect=true&from=signup&step=ngoInfo&subStep=requirements");
        }
        setIsLoading(false);
    }, [isTaxation, reset, router]);

    const showOngoingProjects = watch("hasOngoingProjects");
    const showAwards = watch("hasAwards");

    const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
        control,
        name: "ongoingProjects",
    });

    const { fields: awardFields, append: appendAward, remove: removeAward } = useFieldArray({
        control,
        name: "awards",
    });

    const handleProfileImageChange = (result: any) => {
        if (result) {
            const imageUrl = result.info.secure_url;
            setProfileImage(imageUrl);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            if (subStep === "requirements") {
                if (!profileImage) {
                    setError("root", { message: "Profile image is required" });
                    return;
                }

                // store data in local storage
                localStorage.setItem("ngoInfo", JSON.stringify({
                    ...data,
                    profileImage: profileImage
                }));

                router.push("/auth/signup/ngo?redirect=true&from=signup&step=ngoInfo&subStep=taxation");
            } else if (subStep === "taxation") {
                const ngoInfo = JSON.parse(localStorage.getItem("ngoInfo") || "{}");
                const ngoResponse = await createNGO({
                    ...ngoInfo,
                    ...data
                });

                if (ngoResponse.success) {
                    localStorage.removeItem("ngoInfo");
                    const profileResponse = await uploadImage({ image: ngoInfo.profileImage, id: ngoResponse.data.id }, "ngoProfile");
                    if (profileResponse.success) {
                        Cookies.set("ngo", ngoResponse.data);
                        toast.success(ngoResponse.message);
                        router.push("/auth/login?redirect=true&from=signup");
                    } else {
                        toast.error(profileResponse.error);
                    }
                } else {
                    toast.error(ngoResponse.error);
                }
            }

        } catch (error: any) {
            toast.error("Something went wrong");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto px-2 md:px-8 py-10">
            {isLoading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    {subStep === "requirements" && (
                        <>
                            <h1 className="text-xl md:text-2xl font-bold text-center mb-6">NGO Information</h1>

                            {/* Profile Image Upload */}
                            <div className="flex items-center justify-center mb-8">
                                <div className="flex justify-center gap-1 w-28 h-28 mx-auto relative bg-muted-light dark:bg-muted-dark rounded-full cursor-pointer border-2 border-transparent hover:border-quaternary transition-all duration-300 ease-out overflow-hidden">
                                    <CldUploadWidget
                                        uploadPreset="ngo-darpan"
                                        onSuccess={handleProfileImageChange}
                                    >
                                        {({ open }) => (
                                            <div className="flex justify-center items-center gap-1 w-28 h-28 mx-auto relative bg-muted-light dark:bg-muted-darker z-10 rounded-full cursor-pointer"
                                                onClick={() => open()}>
                                                {profileImage ? (
                                                    <Image src={profileImage} alt="profile" fill className="object-cover" />
                                                ) : (
                                                    <IoMdPerson className="text-primary dark:text-muted z-0" size={60} />
                                                )}
                                            </div>
                                        )}
                                    </CldUploadWidget>
                                </div>
                            </div>
                            {errors.root && <p className="text-red-500 text-xs text-center mb-4">{errors.root.message}</p>}

                            <div className="text-xs text-muted-dark dark:text-muted mb-6">
                                (All fields are required)
                            </div>

                            {/* Main Form Fields in Two Columns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left column */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="name">NGO Name</label>
                                        <input type="text" {...register("name")} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} />
                                        {errors.name && <span className="text-red-500 text-xs">{errors.name.message as string}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="registeredAddress">Registered Address</label>
                                        <input type="text" {...register("registeredAddress")} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} autoComplete="address-line1" />
                                        {errors.registeredAddress && <span className="text-red-500 text-xs">{errors.registeredAddress.message as string}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="operationalAddress">Operational Address</label>
                                        <input type="text" {...register("operationalAddress")} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} autoComplete="address-line1" />
                                        {errors.operationalAddress && <span className="text-red-500 text-xs">{errors.operationalAddress.message as string}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="city">City</label>
                                        <input type="text" {...register("city")} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} autoComplete="city" />
                                        {errors.city && <span className="text-red-500 text-xs">{errors.city.message as string}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="state">State</label>
                                        <input type="text" {...register("state")} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} autoComplete="state" />
                                        {errors.state && <span className="text-red-500 text-xs">{errors.state.message as string}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="country">Country</label>
                                        <input type="text" {...register("country")} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} autoComplete="country" />
                                        {errors.country && <span className="text-red-500 text-xs">{errors.country.message as string}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="pincode">Pincode</label>
                                        <input type="text" {...register("pincode")} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} autoComplete="postal-code" />
                                        {errors.pincode && <span className="text-red-500 text-xs">{errors.pincode.message as string}</span>}
                                    </div>
                                </div>
                                {/* Right column */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="officialEmail">Official Email</label>
                                        <input type="email" {...register("officialEmail")} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} autoComplete="email" />
                                        {errors.officialEmail && <span className="text-red-500 text-xs">{errors.officialEmail.message as string}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="officialPhoneNumber">Official Phone Number</label>
                                        <input type="text" {...register("officialPhoneNumber")} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} autoComplete="tel" />
                                        {errors.officialPhoneNumber && <span className="text-red-500 text-xs">{errors.officialPhoneNumber.message as string}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="contactPersonName">Contact Person Name</label>
                                        <input type="text" {...register("contactPersonName")} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} autoComplete="name" />
                                        {errors.contactPersonName && <span className="text-red-500 text-xs">{errors.contactPersonName.message as string}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="contactPersonDesignation">Contact Person Designation</label>
                                        <input type="text" {...register("contactPersonDesignation")} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} autoComplete="organization-title" />
                                        {errors.contactPersonDesignation && <span className="text-red-500 text-xs">{errors.contactPersonDesignation.message as string}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="contactPersonEmail">Contact Person Email</label>
                                        <input type="email" {...register("contactPersonEmail")} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} autoComplete="email" />
                                        {errors.contactPersonEmail && <span className="text-red-500 text-xs">{errors.contactPersonEmail.message as string}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="contactPersonPhoneNumber">Contact Person Phone Number</label>
                                        <input type="text" {...register("contactPersonPhoneNumber")} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} autoComplete="tel" />
                                        {errors.contactPersonPhoneNumber && <span className="text-red-500 text-xs">{errors.contactPersonPhoneNumber.message as string}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information Section */}
                            <div className="mt-8 pt-8 border-t-2 border-muted dark:border-muted-dark">
                                <h2 className="text-lg md:text-xl font-semibold mb-2">Additional Information</h2>
                                <p className="text-xs text-muted-dark dark:text-muted mb-6">(You can update this information later in NGO profile)</p>
                                <div className="flex flex-col gap-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="annualBudget">Annual Budget</label>
                                            <input type="text" {...register("annualBudget")} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} />
                                            {errors.annualBudget && <span className="text-red-500 text-xs">{errors.annualBudget.message as string}</span>}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="website">Website</label>
                                            <input type="text" {...register("website")} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} />
                                            {errors.website && <span className="text-red-500 text-xs">{errors.website.message as string}</span>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="type">NGO Type</label>
                                            <input type="text" {...register("type")} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} />
                                            {errors.type && <span className="text-red-500 text-xs">{errors.type.message as string}</span>}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="missionStatement">Mission Statement</label>
                                        <textarea {...register("missionStatement")} rows={3} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} />
                                        {errors.missionStatement && <span className="text-red-500 text-xs">{errors.missionStatement.message as string}</span>}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="visionStatement">Vision Statement</label>
                                        <textarea {...register("visionStatement")} rows={3} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} />
                                        {errors.visionStatement && <span className="text-red-500 text-xs">{errors.visionStatement.message as string}</span>}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="description">Description</label>
                                        <textarea {...register("description")} rows={4} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} />
                                        {errors.description && <span className="text-red-500 text-xs">{errors.description.message as string}</span>}
                                    </div>

                                    {/* Area of Work - Simple Input */}
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="areaOfWork">Areas of Work <span className="text-xs text-gray-400">(comma separated)</span></label>
                                        <input
                                            type="text"
                                            {...register("areaOfWork")}
                                            className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")}
                                            placeholder="Education, Healthcare, Environment..."
                                        />
                                        {errors.areaOfWork && <span className="text-red-500 text-xs">{errors.areaOfWork.message as string}</span>}
                                    </div>

                                    {/* Ongoing Projects Section */}
                                    <div className="flex flex-col gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                {...register("hasOngoingProjects")}
                                                className="w-4 h-4 accent-primary"
                                            />
                                            <span>Do you want to add Ongoing Projects?</span>
                                        </label>

                                        {showOngoingProjects && (
                                            <div className="pl-6 flex flex-col gap-6">
                                                {projectFields.map((field, index) => (
                                                    <div key={field.id} className="relative border-2 border-muted p-4 rounded-md">
                                                        {index > 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeProject(index)}
                                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                            >
                                                                <IoMdTrash size={20} />
                                                            </button>
                                                        )}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="flex flex-col gap-1">
                                                                <label>Project Name</label>
                                                                <input
                                                                    type="text"
                                                                    {...register(`ongoingProjects.${index}.name`)}
                                                                    className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")}
                                                                />
                                                                {Array.isArray(errors.ongoingProjects) && errors.ongoingProjects[index]?.name && (
                                                                    <span className="text-red-500 text-xs">{errors.ongoingProjects[index]?.name?.message as string}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <label>Allocated Budget</label>
                                                                <input
                                                                    type="text"
                                                                    {...register(`ongoingProjects.${index}.allocatedBudget`)}
                                                                    className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1 mt-4">
                                                            <label>Description</label>
                                                            <textarea
                                                                {...register(`ongoingProjects.${index}.description`)}
                                                                rows={3}
                                                                className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")}
                                                            />
                                                            {Array.isArray(errors.ongoingProjects) && errors.ongoingProjects[index]?.description && (
                                                                <span className="text-red-500 text-xs">{errors.ongoingProjects[index]?.description?.message as string}</span>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                            <div className="flex flex-col gap-1">
                                                                <label>Top Donators</label>
                                                                <input
                                                                    type="text"
                                                                    {...register(`ongoingProjects.${index}.topDonators`)}
                                                                    className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")}
                                                                />
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <label>Number of Volunteers</label>
                                                                <input
                                                                    type="text"
                                                                    {...register(`ongoingProjects.${index}.numberOfVolunteers`)}
                                                                    className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => appendProject({ name: "", description: "", topDonators: "", allocatedBudget: "", numberOfVolunteers: "" })}
                                                    className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
                                                >
                                                    <IoMdAdd size={20} />
                                                    <span>Add Another Project</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Awards Section */}
                                    <div className="flex flex-col gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                {...register("hasAwards")}
                                                className="w-4 h-4 accent-primary"
                                            />
                                            <span>Do you want to add Awards?</span>
                                        </label>

                                        {showAwards && (
                                            <div className="pl-6 flex flex-col gap-6">
                                                {awardFields.map((field, index) => (
                                                    <div key={field.id} className="relative border-2 border-muted p-4 rounded-md">
                                                        {index > 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeAward(index)}
                                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                            >
                                                                <IoMdTrash size={20} />
                                                            </button>
                                                        )}
                                                        <div className="flex flex-col gap-1">
                                                            <label>Award Name</label>
                                                            <input
                                                                type="text"
                                                                {...register(`awards.${index}.name`)}
                                                                className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")}
                                                            />
                                                            {Array.isArray(errors.awards) && errors.awards[index]?.name && (
                                                                <span className="text-red-500 text-xs">{errors.awards[index]?.name?.message as string}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col gap-1 mt-4">
                                                            <label>Description</label>
                                                            <textarea
                                                                {...register(`awards.${index}.description`)}
                                                                rows={3}
                                                                className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")}
                                                            />
                                                            {Array.isArray(errors.awards) && errors.awards[index]?.description && (
                                                                <span className="text-red-500 text-xs">{errors.awards[index]?.description?.message as string}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => appendAward({ name: "", description: "" })}
                                                    className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
                                                >
                                                    <IoMdAdd size={20} />
                                                    <span>Add Another Award</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center items-center">
                                <button type="submit" className={cn(
                                    "p-2 w-3/4 mx-auto rounded-md bg-secondary text-secondary-dark cursor-pointer hover:bg-secondary-dark transition-all duration-300 hover:text-secondary mt-6",
                                    "dark:bg-muted-dark dark:text-primary dark:hover:text-quinary",
                                    "disabled:opacity-50 disabled:cursor-not-allowed",
                                    "max-md:text-sm max-md:px-4"
                                )} disabled={isSubmitting}>
                                    {isSubmitting ? <div className="flex items-center min-h-6 gap-2 justify-center w-full"><div className="w-4 h-4 border-2 border-tertiary dark:border-quaternary rounded-full animate-spin"></div> </div> : "Submit"}
                                </button>
                            </div>
                        </>
                    )}
                    {
                        subStep === "taxation" && (
                            <>
                                <h1 className="text-xl md:text-2xl font-bold text-center mb-6">Taxation Information</h1>
                                <div className="flex flex-col gap-6 max-w-xl mx-auto">
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="registrationNumber">Registration Number</label>
                                        <input type="text" {...register("registrationNumber", { required: "Registration Number is required" })} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} />
                                        {errors.registrationNumber && <span className="text-red-500 text-xs">{errors.registrationNumber.message as string}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="dateOfRegistration">Date of Registration</label>
                                        <input type="date" {...register("dateOfRegistration", { required: "Date of Registration is required" })} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300")} />
                                        {errors.dateOfRegistration && <span className="text-red-500 text-xs">{errors.dateOfRegistration.message as string}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="panNumber">PAN Number</label>
                                        <input type="text" maxLength={10} {...register("panNumber", { required: "PAN Number is required", minLength: { value: 10, message: "PAN must be 10 characters" }, maxLength: { value: 10, message: "PAN must be 10 characters" } })} className={cn("w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300 uppercase")} />
                                        {errors.panNumber && <span className="text-red-500 text-xs">{errors.panNumber.message as string}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label>Tax Exemption Registration (Upload Image)</label>
                                        <CldUploadWidget uploadPreset="ngo-darpan" onSuccess={(result: any) => setValue("taxExemptionRegistration", result.info.secure_url)}>
                                            {({ open }) => (
                                                taxExemptionValue ? (
                                                    <button type="button" onClick={() => open()} className={`p-1 w-full h-fit border rounded transition-all duration-300 cursor-pointer relative bg-muted hover:bg-muted-dark group`}>
                                                        <Image src={taxExemptionValue} alt="Tax Exemption Registration" width={200} height={200} className="object-contain w-full h-full rounded z-0" />
                                                        <div className="absolute top-0 left-0 w-full h-full group-hover:bg-black/50 rounded justify-center items-center z-10 flex trasition-all duration-300 opacity-0 group-hover:opacity-100 text-xl text-white font-semibold">Change Image</div>
                                                    </button>
                                                ) : (
                                                    <button type="button" onClick={() => open()} className={`p-2 border rounded bg-muted hover:bg-muted-dark transition-all duration-300 cursor-pointer`}>Upload Image</button>
                                                )
                                            )}
                                        </CldUploadWidget>
                                        {watch("taxExemptionRegistration") && <span className="text-xs text-green-600">Image uploaded</span>}
                                        {errors.taxExemptionRegistration && <span className="text-red-500 text-xs">{errors.taxExemptionRegistration.message as string}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label>FCRA Registration (Upload Image)</label>
                                        <CldUploadWidget uploadPreset="ngo-darpan" onSuccess={(result: any) => setValue("fcraRegistration", result.info.secure_url)}>
                                            {({ open }) => (
                                                fcraValue ? (
                                                        <button type="button" onClick={() => open()} className={`p-1 w-full h-fit border rounded transition-all duration-300 cursor-pointer relative bg-muted hover:bg-muted-dark group`}>
                                                            <Image src={fcraValue} alt="FCRA Registration" width={200} height={200} className="object-contain w-full h-full rounded z-0" />
                                                            <div className="absolute top-0 left-0 w-full h-full group-hover:bg-black/50 rounded justify-center items-center z-10 flex trasition-all duration-300 opacity-0 group-hover:opacity-100 text-xl text-white font-semibold">Change Image</div>
                                                        </button>
                                                ) : (
                                                    <button type="button" onClick={() => open()} className={`p-2 border rounded bg-muted hover:bg-muted-dark transition-all duration-300 cursor-pointer`}>Upload Image</button>
                                                )
                                            )}
                                        </CldUploadWidget>
                                        {watch("fcraRegistration") && <span className="text-xs text-green-600">Image uploaded</span>}
                                        {errors.fcraRegistration && <span className="text-red-500 text-xs">{errors.fcraRegistration.message as string}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label>Registration Certificate (Upload Image)</label>
                                        <CldUploadWidget uploadPreset="ngo-darpan" onSuccess={(result: any) => setValue("registrationCertificate", result.info.secure_url)}>
                                            {({ open }) => (
                                                registrationCertificateValue ? (
                                                    <button type="button" onClick={() => open()} className={`p-1 w-full h-fit border rounded transition-all duration-300 cursor-pointer relative bg-muted hover:bg-muted-dark group`}>
                                                        <Image src={registrationCertificateValue} alt="Registration Certificate" width={200} height={200} className="object-contain w-full h-full rounded z-0" />
                                                        <div className="absolute top-0 left-0 w-full h-full group-hover:bg-black/50 rounded justify-center items-center z-10 flex trasition-all duration-300 opacity-0 group-hover:opacity-100 text-xl text-white font-semibold">Change Image</div>
                                                    </button>
                                                ) : (
                                                    <button type="button" onClick={() => open()} className={`p-2 border rounded bg-muted hover:bg-muted-dark transition-all duration-300 cursor-pointer`}>Upload Image</button>
                                                )
                                            )}
                                        </CldUploadWidget>
                                        {watch("registrationCertificate") && <span className="text-xs text-green-600">Image uploaded</span>}
                                        {errors.registrationCertificate && <span className="text-red-500 text-xs">{errors.registrationCertificate.message as string}</span>}
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <button type="submit" className={cn(
                                            "p-2 w-3/4 mx-auto rounded-md bg-secondary text-secondary-dark cursor-pointer hover:bg-secondary-dark transition-all duration-300 hover:text-secondary mt-6",
                                            "dark:bg-muted-dark dark:text-primary dark:hover:text-quinary",
                                            "disabled:opacity-50 disabled:cursor-not-allowed",
                                            "max-md:text-sm max-md:px-4"
                                        )} disabled={isSubmitting}>
                                            {isSubmitting ? <div className="flex items-center min-h-6 gap-2 justify-center w-full"><div className="w-4 h-4 border-2 border-tertiary dark:border-quaternary rounded-full animate-spin"></div> </div> : "Submit"}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )
                    }
                </>
            )}
        </form>
    );
}