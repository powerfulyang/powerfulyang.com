import { useFormRouteListener } from '@/hooks/useFormDiscardWarning';
import { useNotification } from '@/hooks/useNotification';

export const GlobalHooks = () => {
  // 获取通知权限
  useNotification();
  // 路由变化时，表单未提交的提示
  useFormRouteListener();

  return null;
};
