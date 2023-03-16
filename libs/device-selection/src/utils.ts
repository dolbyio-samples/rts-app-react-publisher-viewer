export const deviceElementResolver = (element: unknown) => {
  const device = element as InputDeviceInfo;
  return {
    data: device,
    id: device.deviceId,
    label: device.label,
  };
};
