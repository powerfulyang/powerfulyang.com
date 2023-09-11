import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserLayout } from '@/layout/UserLayout';
import type { LayoutFC } from '@/types/GlobalContext';

const WifiShare: LayoutFC = () => {
  return (
    <div className="flex flex-col items-center space-y-4 p-10">
      <h3 className="text-3xl font-medium">Wifi Share</h3>
      <span className="!mb-4 text-[#1b233d]/70">Generate QR code for sharing wifi</span>
      <div className="grid w-[80%] max-w-[800px] gap-4">
        <Label>Wifi Name:</Label>
        <Input type="text" placeholder="SSID" />
        <Label>Password:</Label>
        <Input type="text" placeholder="Password" />
        <Label>Encryption:</Label>
        <RadioGroup>
          <Label className="flex gap-2">
            <RadioGroupItem value="None" />
            <span>None</span>
          </Label>
          <Label className="flex gap-2">
            <RadioGroupItem value="WPA/WPA2" />
            <span>WPA/WPA2</span>
          </Label>
          <Label className="flex gap-2">
            <RadioGroupItem value="WEP" />
            <span>WEP</span>
          </Label>
        </RadioGroup>
      </div>
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
