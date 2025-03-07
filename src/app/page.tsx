import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Page() {
  const cookieStore = cookies();
  const user = cookieStore.get("user");

  if (!user) {
    return redirect("/auth");
  }

  try {
    const userData = JSON.parse(user.value); // Supondo que o cookie tenha um JSON stringificado
    const role = userData.role

    if (role === 9) {
      return redirect("/dashboard");
    }

    if (role === 1) {
      return redirect("/home");
      
    }
  } catch (error) {
    return redirect("/auth"); // Redireciona para login em caso de erro
  }

  return redirect("/auth"); // Fallback padrão
}
