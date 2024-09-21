import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";

const schema = z.object({
  name: z.string({ 
    required_error: "Name is required",
    message: "Preencha seu nome",
    invalid_type_error: "Name must be a string",
  }),
  email: z.string().email({ message: "E-mail inválido" }),
});

type Inputs = z.infer<typeof schema>;

const Newsletter = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: Inputs) => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
  
      const resData = await res.json();
  
      toast.success(resData.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <label htmlFor="name" className="block text-sm text-#0a0a0a font-bold">Seu nome</label>
        <input
          type="text"
          id="name"
          placeholder="Mc Lovin"
          {...register("email")}
          disabled={loading}
          className="py-3 px-2 block w-medium text-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900"
        />

        <label htmlFor="email" className="block text-sm text-#0a0a0a font-bold">Seu nome</label>
        <input
          type="email"
          placeholder="ex: email@email.com"
          id="email"
          {...register("email")}
          disabled={loading}
          className="py-3 px-4 block text-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-blue-500 text-white rounded-md"
        >
          {loading ? "Carregando..." : "Assinar"}
        </button>
      </form>
      <Toaster />
    </div>
  );
};

export default Newsletter;