import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyAnisa as verifyAnisaApi } from "../services/apiAnisa";
import toast from "react-hot-toast";
import { verifyClient as ApiverifyClient } from "../services/apiClient.ts";

const useVerifyAnisa = () => {
  const queryClient = useQueryClient();

  const { mutate: verifyAnisa, isPending: isVerifying } = useMutation({
    mutationFn: ({ anisaID }: { anisaID: string }) =>
      toast.promise(verifyAnisaApi({ anisaID }), {
        loading: "Verifying...",
        success: "Anisa verified successfully",
        error: "Anisa verification failed",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anisas"] });
    },
  });

  return { verifyAnisa, isVerifying };
};

const useVerifyClient = () => {
  const queryClient = useQueryClient();
  const { mutate: verifyClient, isPending: isVerifying } = useMutation({
    mutationFn: ({ clientId }: { clientId: string }) =>
      toast.promise(ApiverifyClient(clientId), {
        loading: "Verifying...",
        success: "Client verified successfully",
        error: "Client verification failed",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  return { verifyClient, isVerifying };
};

export { useVerifyAnisa, useVerifyClient };
