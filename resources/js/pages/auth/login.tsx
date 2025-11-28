import AuthLayout from "@/Layouts/auth-layout";
import { Head, useForm } from "@inertiajs/react";
import { AtSign, LogIn, SquareAsterisk } from "lucide-react";
import React from "react";

export default function Login() {
    // form helper inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
    });

    // submit method
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset(),
        });
    };

    return (
        <>
            <Head title="Login" />
            <div className="border p-6 sm:p-10 rounded-2xl w-full max-w-lg">
                <h1 className="text-gray-700 dark:text-gray-300 text-2xl font-semibold mb-2">
                    Login
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Selamat datang, silahkan masukan email dan password untuk
                    memulai sesi anda.
                </p>
                <form onSubmit={submit}>
                    <div className="flex flex-col gap-2 mb-5">
                        <label className="text-gray-600 dark:text-gray-400 text-sm">
                            Email<span className="text-rose-500">*</span>
                        </label>
                        <div className="flex">
                            <span className="flex items-center px-3 pointer-events-none sm:text-sm rounded-l-md dark:bg-gray-900 border border-r-0 dark:border-gray-800">
                                <AtSign className="size-4 dark:text-gray-400 text-gray-600" />
                            </span>
                            <input
                                type="email"
                                placeholder="masukan email anda"
                                className="w-full border text-sm rounded-r-md border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 focus:border-gray-200 focus:ring-0"
                                autoComplete="off"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                value={data.email}
                            />
                        </div>
                        {errors.email && (
                            <span className="text-xs text-rose-500">
                                {errors.email}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 mb-8">
                        <label className="text-gray-600 dark:text-gray-400 text-sm">
                            Kata Sandi<span className="text-rose-500">*</span>
                        </label>
                        <div className="flex">
                            <span className="flex items-center px-3 pointer-events-none sm:text-sm rounded-l-md dark:bg-gray-900 border border-r-0 dark:border-gray-800">
                                <SquareAsterisk className="size-4 dark:text-gray-400 text-gray-600" />
                            </span>
                            <input
                                type="password"
                                placeholder="masukan kata sandi anda"
                                className="w-full border text-sm rounded-r-md border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 focus:border-gray-200 focus:ring-0"
                                autoComplete="off"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                value={data.password}
                            />
                        </div>
                        {errors.password && (
                            <span className="text-xs text-rose-500">
                                {errors.password}
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-1 w-full p-2 border rounded-md dark:text-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-950 text-sm"
                        disabled={processing}
                    >
                        Login <LogIn className="size-4" />
                    </button>
                </form>
            </div>
        </>
    );
}

Login.layout = (page: React.ReactNode) => <AuthLayout children={page} />;
