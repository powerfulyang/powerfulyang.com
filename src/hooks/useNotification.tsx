import { clientApi } from '@/request/requestTool';
import { Button, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

function sendSubscriptionToServer(subscription: PushSubscription) {
  // 将订阅对象发送到服务器
  return clientApi.webPushSubscribe(subscription.toJSON());
}

const subscribe = () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    // 获取订阅对象
    navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
      serviceWorkerRegistration.pushManager.getSubscription().then((subscription) => {
        if (subscription) {
          return sendSubscriptionToServer(subscription);
        }
        // 用户尚未订阅
        navigator.serviceWorker.ready.then((_serviceWorkerRegistration) => {
          _serviceWorkerRegistration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey:
                'BDT8NHhgHVZq2UuiNSpGtq4RT62uiC716JDhMjcgpOr6NDG55jobhdjYoqvdHSz1zpPh54VlzjHGarE013WDFOE',
            })
            .then((_subscription) => {
              // 订阅成功，将订阅对象发送到服务器
              return sendSubscriptionToServer(_subscription);
            });
        });
        return null;
      });
    });
  }
};

export const useNotification = () => {
  useQuery({
    queryKey: ['useNotification'],
    queryFn: () => {
      if (Notification.permission === 'granted') {
        // 已经有权限，可以发送通知
        subscribe();
      } else if (Notification.permission !== 'denied') {
        toast(
          (t) => {
            return (
              <div className="pb-2 pt-4">
                <div className="mb-2">
                  为了提供最佳的体验，我们需要你的通知权限。这将帮助我们在有新的内容、更新或警告时立即通知你。
                </div>
                <Stack gap={2} direction="row" justifyContent="end">
                  <Button
                    variant="contained"
                    onClick={() => {
                      Notification.requestPermission().then((permission) => {
                        if (permission === 'granted') {
                          // 获得了权限，可以发送通知
                          subscribe();
                        }
                      });
                      toast.dismiss(t.id);
                    }}
                  >
                    允许
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      toast.dismiss(t.id);
                    }}
                  >
                    拒绝
                  </Button>
                </Stack>
              </div>
            );
          },
          {
            position: 'top-right',
            duration: Infinity,
          },
        );
      }
      return Promise.resolve('ok');
    },
  });
};
