export default async function unwrapSupabaseStorageError(err: any): Promise<{
  message: string;
  status: number;
}> {
  if (err?.__isStorageError && err.originalError instanceof Response) {
    const res = err.originalError;

    let message = res.statusText || "Supabase storage error";

    try {
      const body = await res.clone().json();
      if (body?.message) message = body.message;
      else if (body?.error) message = body.error;
    } catch {}

    return {
      message,
      status: res.status || 500,
    };
  }

  // Fallback
  if (err instanceof Error) {
    return {
      message: err.message,
      status: 500,
    };
  }

  return {
    message: "Unknown error",
    status: 500,
  };
}
