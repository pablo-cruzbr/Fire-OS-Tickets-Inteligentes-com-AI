/*
 * Native signature pad: the WebView-based react-native-signature-canvas.
 * Web gets ./index.web.tsx (a plain <canvas>) with the same ref + onOK contract,
 * because WebView is not supported by react-native-web.
 */
import SignatureScreen from "react-native-signature-canvas";

export type { SignatureViewRef } from "react-native-signature-canvas";
export default SignatureScreen;
