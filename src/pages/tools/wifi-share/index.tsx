import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserLayout } from '@/layout/UserLayout';
import type { LayoutFC } from '@/types/GlobalContext';

const WifiShare: LayoutFC = () => {
  return (
    <div className="p-4">
      <Label>
        <span>Wifi Name:</span>
        <Input type="text" placeholder="SSID" />
      </Label>
      <Label>
        <span>Password:</span>
        <Input type="text" placeholder="Password" />
      </Label>
      <Label>
        <span>Encryption:</span>
        <RadioGroup>
          <RadioGroupItem value="None">None</RadioGroupItem>
          <RadioGroupItem value="WPA/WPA2">WPA/WPA2</RadioGroupItem>
          <RadioGroupItem value="WEP">WEP</RadioGroupItem>
        </RadioGroup>
      </Label>
    </div>
  );
};

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: 'Wifi Share',
        description: 'Wifi Share',
      },
    },
  };
};

WifiShare.getLayout = (page) => {
  return <UserLayout>{page}</UserLayout>;
};

export default WifiShare;
