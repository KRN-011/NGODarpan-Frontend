'use client'

import ProfileLayout from "@/layout/ProfileLayout";
import { useEffect, useState } from "react";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { IoMdPerson, IoMdTrash } from "react-icons/io";
import { updateProfile, uploadImage } from "@/lib/api";
import { CldUploadWidget } from 'next-cloudinary';
import Image from "next/image";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { dispatchUserUpdate } from "@/layout/Header";


const profileSchema = z.object({
    firstname: z.string().min(1, { message: "First name is required" }).max(20, { message: "First name must be less than 20 characters" }),
    lastname: z.string().min(1, { message: "Last name is required" }).max(20, { message: "Last name must be less than 20 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    secondaryEmail: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }).max(10, { message: "Phone number must be less than 10 digits" }),
    secondaryPhoneNumber: z.string().min(1, { message: "Secondary phone number is required" }).max(10, { message: "Secondary phone number must be less than 10 digits" }),
    dateOfBirth: z.string().min(1, { message: "Date of birth is required" }).refine(
        (val) => {
            const date = new Date(val);
            return !isNaN(date.getTime()) && date <= new Date();
        },
        { message: "Date of birth must be a valid date in the past" }).refine((val) => {
            const date = new Date(val);
            const today = new Date();
            const age = today.getFullYear() - date.getFullYear();
            const monthDiff = today.getMonth() - date.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
                age - 1;
            }

            return age >= 18;
        }, { message: "You must be at least 18 years old" }),
    profileVisibility: z.enum(["YES", "NO"], { message: "Profile visibility is required" }),
    gender: z.enum(["MALE", "FEMALE"], { message: "Gender is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    pincode: z.string().min(1, { message: "Pincode is required" }),
    bio: z.string().min(1, { message: "Bio is required" }),
    address: z.string().min(1, { message: "Address is required" }),
})

type ProfileForm = z.infer<typeof profileSchema>;

export default function Profile() {

    // non-state variables
    const router = useRouter();

    // state variables
    const [user, setUser] = useState<any>(null)
    const [profileImage, setProfileImage] = useState<string | null>(null);

    // handle profile image change
    const handleProfileImageChange = (result: any) => {
        if (result) {
            // Store the Cloudinary URL
            const imageUrl = result.info.secure_url;
            setProfileImage(imageUrl);
        }
    }

    // form variables
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, setValue } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstname: user?.profile?.firstname || "",
            lastname: user?.profile?.lastname || "",
            email: user?.email || "",
            secondaryEmail: user?.profile?.secondaryEmail || "",
            phoneNumber: user?.profile?.phoneNumber || "",
            secondaryPhoneNumber: user?.profile?.secondaryPhoneNumber || "",
            dateOfBirth: user?.profile?.dateOfBirth
                ? new Date(user.profile.dateOfBirth).toISOString().split('T')[0]
                : "",
            profileVisibility: user?.profile?.profileVisibility || "YES",
            gender: user?.profile?.gender || "MALE",
            country: user?.profile?.country || "",
            pincode: user?.profile?.pincode || "",
            bio: user?.profile?.bio || "",
            address: user?.profile?.address || "",
        }
    })

    useEffect(() => {
        setValue("firstname", user?.profile?.firstname || "");
        setValue("lastname", user?.profile?.lastname || "");
        setValue("email", user?.email || "");
        setValue("secondaryEmail", user?.profile?.secondaryEmail || "");
        setValue("phoneNumber", user?.profile?.phoneNumber || "");
        setValue("secondaryPhoneNumber", user?.profile?.secondaryPhoneNumber || "");
        setValue("dateOfBirth", user?.profile?.dateOfBirth
            ? new Date(user.profile.dateOfBirth).toISOString().split('T')[0]
            : "");
        setValue("profileVisibility", user?.profile?.profileVisibility ? "YES" : "NO");
        setValue("gender", user?.profile?.gender || "MALE");
        setValue("country", user?.profile?.country || "");
        setValue("pincode", user?.profile?.pincode || "");
        setValue("bio", user?.profile?.bio || "");
        setValue("address", user?.profile?.address || "");
    }, [user])

    const onSubmit = async (data: ProfileForm) => {
        try {
            if (!profileImage) {
                setError("root", { message: "Profile image is required" });
                return;
            }

            const imageResponse = await uploadImage({image: profileImage}, "userProfile");

            const profileResponse = await updateProfile(data);

            if (imageResponse.success && profileResponse.success) {
                toast.success(profileResponse.message);
                const updatedUser = {
                    ...user,
                    profile: profileResponse.updatedProfile
                }
                setUser(updatedUser);
                Cookies.set('user', JSON.stringify(updatedUser));
                dispatchUserUpdate(); // Dispatch user update event for Header
            }

        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }

    // get user profile 
    useEffect(() => {
        const user = Cookies.get('user')
        if (user) {
            setUser(JSON.parse(user))
        }
    }, [])

    // set profile image
    useEffect(() => {
        if (user?.profile?.profileImage) {
            setProfileImage(user?.profile?.profileImage)
        }
    }, [user])

    return (
        <ProfileLayout>
            <div className="text-sm md:text-base dark:text-muted-light">
                <h1 className="text-2xl font-bold px-10 dark:text-white">Profile</h1>
                <div className="w-full h-[1px] bg-muted-light dark:bg-muted my-5" />
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-10 max-md:max-w-md mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="flex justify-center gap-1 w-28 h-28 mx-auto relative bg-muted-light dark:bg-muted-darker rounded-full cursor-pointer border-2 border-transparent hover:border-quaternary transition-all duration-300 ease-out overflow-hidden">
                            <CldUploadWidget
                                uploadPreset="ngo-darpan"
                                onSuccess={handleProfileImageChange}
                            >
                                {({ open }) => (
                                    <div className={`flex justify-center items-center gap-1 w-28 h-28 mx-auto relative bg-muted-light dark:bg-muted-darker z-10 rounded-full cursor-pointer`}
                                        onClick={() => open()}>
                                        {
                                            profileImage ? (
                                                <Image src={profileImage} alt="profile" fill className="object-cover " />
                                            ) : (
                                                <IoMdPerson className="text-primary dark:text-muted z-0" size={60} />
                                            )
                                        }
                                    </div>
                                )}
                            </CldUploadWidget>
                        </div>
                    </div>
                    {errors.root && <p className="text-red-500 text-sm bottom-0  text-center">{errors.root.message}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="firstname">First Name</label>
                            <input type="text" id="firstname"
                                className={cn(
                                    "w-full p-2 rounded-md border border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                    "dark:border-muted-darker text-sm md:text-base"
                                )}
                                {...register("firstname")} />
                            {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="lastname">Last Name</label>
                            <input type="text" id="lastname"
                                    className={cn(
                                        "w-full p-2 rounded-md border border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                        "dark:border-muted-darker text-sm md:text-base"
                                    )}
                                    {...register("lastname")} />
                            {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email"
                                className={cn(
                                    "w-full p-2 rounded-md border border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                    "dark:border-muted-darker text-sm md:text-base"
                                )}
                                {...register("email")} />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="secondaryEmail">Secondary Email</label>
                            <input type="email" id="secondaryEmail"
                                className={cn(
                                    "w-full p-2 rounded-md border border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                    "dark:border-muted-darker text-sm md:text-base"
                                )}
                                {...register("secondaryEmail")} />
                            {errors.secondaryEmail && <p className="text-red-500 text-sm">{errors.secondaryEmail.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="phone">Phone</label>
                            <input type="text" id="phone"
                                className={cn(
                                    "w-full p-2 rounded-md border border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                    "dark:border-muted-darker text-sm md:text-base"
                                )}
                                {...register("phoneNumber")} />
                            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="secondaryPhone">Secondary Phone</label>
                            <input type="text" id="secondaryPhone"
                                className={cn(
                                    "w-full p-2 rounded-md border border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                    "dark:border-muted-darker text-sm md:text-base"
                                )}
                                {...register("secondaryPhoneNumber")} />
                            {errors.secondaryPhoneNumber && <p className="text-red-500 text-sm">{errors.secondaryPhoneNumber.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="dateOfBirth">Date of Birth</label>
                            <input type="date" id="dateOfBirth"
                                className={cn(
                                    "w-full p-2 rounded-md border border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                    "dark:border-muted-darker text-sm md:text-base"
                                )}
                                {...register("dateOfBirth")} />
                            {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}
                        </div>
                        <div className="flex flex-col gap-3 mt-3">
                            <div className="flex items-center gap-10">
                                <div className="flex items-center gap-10">
                                    <label>Profile Visibility :</label>
                                    <div className="flex gap-4 items-center">
                                        <label className="flex items-center gap-1">
                                            <input type="radio" value="YES" {...register("profileVisibility")} className="accent-primary dark:accent-muted-darker" /> Yes
                                        </label>
                                        <label className="flex items-center gap-1">
                                            <input type="radio" value="NO" {...register("profileVisibility")} className="accent-primary dark:accent-muted-darker" /> No
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-10">
                                <label>Gender :</label>
                                <div className="flex gap-4 items-center">
                                    <label className="flex items-center gap-1">
                                        <input type="radio" value="MALE" {...register("gender")} className="accent-primary dark:accent-muted-darker" /> Male
                                    </label>
                                    <label className="flex items-center gap-1">
                                        <input type="radio" value="FEMALE" {...register("gender")} className="accent-primary dark:accent-muted-darker" /> Female
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="country">Country</label>
                            <input type="text" id="country"
                                className={cn(
                                    "w-full p-2 rounded-md border border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                    "dark:border-muted-darker text-sm md:text-base"
                                )}
                                {...register("country")} />
                            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="pincode">Pincode</label>
                            <input type="text" id="pincode"
                                className={cn(
                                    "w-full p-2 rounded-md border border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                    "dark:border-muted-darker text-sm md:text-base"
                                )}
                                {...register("pincode")} />
                            {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="bio">Bio</label>
                            <textarea id="bio"
                                className={cn(
                                    "w-full p-2 rounded-md border border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                    "dark:border-muted-darker text-sm md:text-base"
                                )}
                                rows={3} {...register("bio")} />
                            {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="address">Address</label>
                            <textarea id="address"
                                className={cn(
                                    "w-full h-full p-2 rounded-md border border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                    "dark:border-muted-darker text-sm md:text-base"
                                )}
                                rows={2} {...register("address")} />
                            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={cn(
                            "p-2 w-3/4 md:w-1/4 mx-auto rounded-md bg-primary text-tertiary cursor-pointer hover:bg-primary-light transition-all duration-300 hover:text-quaternary mt-4 text-sm md:text-base",
                            "dark:bg-muted-darker dark:text-primary hover:bg-muted dark:hover:text-quinary",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <div className="flex items-center min-h-6 gap-2 justify-center w-full"><div className="w-4 h-4 border-2 border-tertiary dark:border-quaternary rounded-full animate-spin"></div></div> : "Update Profile"}
                    </button>
                </form>
            </div>
        </ProfileLayout>
    )
}