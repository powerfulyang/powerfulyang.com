import { useEffect } from 'react';

function sendSubscriptionToServer(subscription: PushSubscription) {
  // 将订阅对象发送到服务器
  return fetch('/web-push/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });
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
        // 进行订阅请求，类似上面的 subscribe() 方法
        // 请求订阅权限
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
  useEffect(() => {
    if (Notification.permission === 'granted') {
      // 已经有权限，可以发送通知
      subscribe();
    } else if (Notification.permission !== 'denied') {
      // 请求权限
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          // 获得了权限，可以发送通知
          subscribe();
        } else {
          // 用户拒绝了通知权限
        }
      });
    }
  }, []);
};
