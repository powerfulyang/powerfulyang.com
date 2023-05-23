/* eslint-disable no-restricted-globals */

export declare const self: ServiceWorkerGlobalScope & typeof window;

self.addEventListener('push', (event) => {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return Promise.resolve();
  }
  if (!event.data) return Promise.resolve();
  const data: {
    title: string;
    message: string;
  } = event.data.json();
  // 解析通知内容
  const { title } = data;
  const { message } = data;
  const icon = 'https://powerfulyang.com/icons/apple-touch-icon.png';
  return self.registration.showNotification(title, {
    body: message,
    icon,
  });
});

// 处理通知消息的点击事件
self.onnotificationclick = (event) => {
  event.notification.close();

  event.waitUntil(self.clients.openWindow('https://powerfulyang.com'));
};
