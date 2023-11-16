import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserLayout } from '@/layout/UserLayout';
import { generateQRCode } from '@/lib/qrcode/generate';
import type { LayoutFC } from '@/types/GlobalContext';
import { useImmer } from '@powerfulyang/hooks';
import { useQuery } from '@tanstack/react-query';
import { useDeferredValue, useRef } from 'react';

const WifiShare: LayoutFC = () => {
  const [_state, setState] = useImmer({
    SSID: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });

  const ref = useRef<HTMLCanvasElement>(null!);
  const state = useDeferredValue(_state);

  useQuery({
    queryKey: ['wifi-share', state],
    queryFn: async () => {
      const text = `WIFI:T:${state.encryption};S:${state.SSID};P:${state.password};H:${state.hidden};;`;
      await generateQRCode(ref.current, {
        text,
        ecc: 'M',
        margin: 1,
        scale: 20,
        lightColor: '#ffffff',
        darkColor: '#000000',
        pixelStyle: 'rounded',
        markerStyle: 'auto',
        markerShape: 'square',
        markerInnerShape: 'auto',
        markerSub: 'square',
        markers: [],
        maskPattern: -1,
        minVersion: 1,
        maxVersion: 40,
        boostECC: false,
        rotate: 0,
        invert: false,
        marginNoise: false,
        marginNoiseRate: 0.5,
        marginNoiseOpacity: 1,
        seed: 39786,
        marginNoiseSpace: 'full',
        renderPointsType: 'all',
        effect: 'none',
        effectTiming: 'after',
        effectCrystalizeRadius: 8,
        effectLiquidifyDistortRadius: 8,
        effectLiquidifyRadius: 8,
        effectLiquidifyThreshold: 128,
        transformPerspectiveX: 0,
        transformPerspectiveY: 0,
        transformScale: 1,
      });
      return text;
    },
  });

  return (
    <div className="flex flex-col items-center space-y-4 p-10">
      <h3 className="text-3xl font-medium">Wifi Share</h3>
      <span className="!mb-4 text-[#1b233d]/70">Generate QR code for sharing wifi</span>
      <div className="grid w-full max-w-[800px] gap-4">
        <Label>Wifi Name:</Label>
        <div className="flex w-full items-center gap-4">
          <Input
            value={state.SSID}
            onChange={(event) => {
              setState((draft) => {
                draft.SSID = event.target.value;
              });
            }}
            type="text"
            placeholder="SSID"
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hidden"
              onCheckedChange={(checked) => {
                setState((draft) => {
                  draft.hidden = checked === true;
                });
              }}
            />
            <Label htmlFor="hidden">Hidden</Label>
          </div>
        </div>
        <Label>Password:</Label>
        <Input
          value={state.password}
          onChange={(event) => {
            setState((draft) => {
              draft.password = event.target.value;
            });
          }}
          type="text"
          placeholder="Password"
        />
        <Label>Encryption:</Label>
        <RadioGroup
          value={state.encryption}
          onValueChange={(value) => {
            setState((draft) => {
              draft.encryption = value;
            });
          }}
        >
          <Label className="flex gap-2">
            <RadioGroupItem value="nopass" />
            <span>None</span>
          </Label>
          <Label className="flex gap-2">
            <RadioGroupItem value="WPA" />
            <span>WPA/WPA2/WPA3</span>
          </Label>
          <Label className="flex gap-2">
            <RadioGroupItem value="WEP" />
            <span>WEP (Wired Equivalent Privacy)</span>
          </Label>
        </RadioGroup>
        {state.SSID && <canvas className="m-auto mt-4 h-[300px] w-[300px]" ref={ref} />}
      </div>
    </div>
  );
};

export const getStaticProps = () => {
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
