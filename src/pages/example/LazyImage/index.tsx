import { LazyImage } from '@/components/LazyImage';
import { CosUtils } from '@/utils/lib';

const LazyImageExample = () => {
  return (
    <LazyImage
      src={CosUtils.getCosObjectUrl(
        'https://instagram-1253520329.cos.ap-shanghai.myqcloud.com/701738f4d680deccb60df4fa686fb6858c1f502c.jpeg?q-sign-algorithm=sha1&q-ak=AKIDjMo5DCRjFbMxOn687vmjYEj7KNFwLp0z&q-sign-time=1639298323;1639384723&q-key-time=1639298323;1639384723&q-header-list=host&q-url-param-list=&q-signature=25d3703192bf517bf27e65fec871189b3745766d',
      )}
      blurSrc={CosUtils.getCosObjectBlurUrl(
        'https://instagram-1253520329.cos.ap-shanghai.myqcloud.com/701738f4d680deccb60df4fa686fb6858c1f502c.jpeg?q-sign-algorithm=sha1&q-ak=AKIDjMo5DCRjFbMxOn687vmjYEj7KNFwLp0z&q-sign-time=1639298323;1639384723&q-key-time=1639298323;1639384723&q-header-list=host&q-url-param-list=&q-signature=25d3703192bf517bf27e65fec871189b3745766d',
      )}
    />
  );
};

export default LazyImageExample;
