export const deviceElementResolver = (element: unknown) => {
  const device = element as InputDeviceInfo;
  return {
    id: device.deviceId,
    label: device.label,
    data: device,
  };
};
