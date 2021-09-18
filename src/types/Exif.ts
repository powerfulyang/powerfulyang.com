export interface Exif {
  ImageWidth: number;
  ImageHeight: number;
  RelatedImageWidth: number;
  RelatedImageHeight: number;
  ImageDescription: string;
  Make: string;
  Model: string;
  SerialNumber: string;
  Orientation: number;
  XResolution: number;
  YResolution: number;
  ResolutionUnit: number;
  BitsPerSample: number;
  Software: string;
  DateTime: string;
  DateTimeOriginal: string;
  DateTimeDigitized: string;
  SubSecTimeOriginal: string;
  ExposureTime: number;
  Copyright: string;
  FNumber: number;
  ExposureProgram: number;
  ISOSpeedRatings: number;
  ShutterSpeedValue: number;
  ApertureValue: number;
  BrightnessValue: number;
  ExposureBiasValue: number;
  SubjectDistance: number;
  FocalLength: number;
  Flash: number;
  SubjectArea: number[];
  MeteringMode: number;
  LightSource: number;
  ProjectionType: number;
  Calibration: Calibration;
  LensInfo: LensInfo;
  GeoLocation: GeoLocation;
  GPano: GPano;
}

export interface Calibration {
  FocalLength: number;
  OpticalCenterX: number;
  OpticalCenterY: number;
}

export interface GPano {
  PosePitchDegrees: number;
  PoseRollDegrees: number;
}

export interface GeoLocation {
  Latitude: number;
  Longitude: number;
  Altitude: number;
  AltitudeRef: number;
  RelativeAltitude: number;
  RollDegree: number;
  PitchDegree: number;
  YawDegree: number;
  SpeedX: number;
  SpeedY: number;
  SpeedZ: number;
  AccuracyXY: number;
  AccuracyZ: number;
  GPSDOP: number;
  GPSDifferential: number;
  GPSMapDatum: string;
  GPSTimeStamp: string;
  GPSDateStamp: string;
}

export interface LensInfo {
  FStopMin: number;
  FStopMax: number;
  FocalLengthMin: number;
  FocalLengthMax: number;
  DigitalZoomRatio: number;
  FocalLengthIn35mm: number;
  FocalPlaneXResolution: number;
  FocalPlaneYResolution: number;
  FocalPlaneResolutionUnit: number;
  Make: string;
  Model: string;
}
