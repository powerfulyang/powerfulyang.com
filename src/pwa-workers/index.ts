export declare const self: ServiceWorkerGlobalScope & typeof window;

self.addEventListener('push', (event) => {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return Promise.resolve();
  }
  if (!event.data) return Promise.resolve();
  const data: {
    title: string;
    message: string;
    icon: string;
  } = event.data.json();
  // 解析通知内容
  const { title, message, icon = 'https://powerfulyang.com/icons/apple-touch-icon.png' } = data;
  return self.registration.showNotification(title, {
    body: message,
    icon,
    data,
  });
});

// 处理通知消息的点击事件
self.onnotificationclick = (event) => {
  event.notification.close();
  if (event.notification.data.openUrl) {
    event.waitUntil(self.clients.openWindow(event.notification.data.openUrl));
  }
};
