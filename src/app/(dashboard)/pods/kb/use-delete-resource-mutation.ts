import { useMutation } from '@tanstack/react-query';

import { useQueryClient } from '@tanstack/react-query';
import { KbResources } from './use-kb-resources-query';

export default function useDeleteResourceMutation(
  kbId: string,
  parentPath: string,
) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (resourcePath: string) => {
      const res = await fetch(
        `/api/kb/${kbId}/resources?resource_path=${resourcePath}`,
        {
          method: 'DELETE',
        },
      );
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      await res.text();
      return resourcePath;
    },
    onMutate: async (resourcePath) => {
      await queryClient.cancelQueries({
        queryKey: ['kb-resources', kbId, parentPath],
      });
      const previousResources = queryClient.getQueryData<KbResources>([
        'kb-resources',
        kbId,
        parentPath,
      ]);
      queryClient.setQueryData(
        ['kb-resources', kbId, parentPath],
        (old: KbResources) =>
          old.filter((resource) => resource.inode_path.path !== resourcePath),
      );
      return previousResources;
    },
    onSuccess: (resourcePath) => {
      queryClient.setQueryData(
        ['kb-resources', kbId, parentPath],
        (old: KbResources) =>
          old.filter((resource) => resource.inode_path.path !== resourcePath),
      );
    },
  });
  return mutation;
}
