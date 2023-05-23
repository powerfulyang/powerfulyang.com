/* eslint-disable no-restricted-globals */

export declare const self: ServiceWorkerGlobalScope & typeof window;

self.addEventListener('push', (event) => {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }
  if (!event.data) return;
  const data: {
    title: string;
    message: string;
  } = event.data.json();
  // 解析通知内容
  const { title } = data;
  const { message } = data;
  const icon =
    'https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2017/10/1507698696SitePoint@2x-96x96.png';
  const notification = self.registration.showNotification(title, {
    body: message,
    icon,
  });
  notification.catch((err) => console.error(err));
});

// 处理通知消息的点击事件
self.onnotificationclick = async (ev) => {
  const clients = new Clients();
  if (clients.openWindow) {
    await clients.openWindow(ev.notification.body);
  }
};
