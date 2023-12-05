var N = Object.defineProperty;
var b = (e, a) => {
  for (var t in a) N(e, t, { get: a[t], enumerable: !0 });
};
var w = {};
b(w, {
  authenticate: () => Y,
  isAvailable: () => H,
  isLocalAuthenticator: () => A,
  register: () => v,
});
var u = {};
b(u, {
  bufferToHex: () => h,
  concatenateBuffers: () => p,
  isBase64url: () => m,
  parseBase64url: () => c,
  parseBuffer: () => O,
  randomChallenge: () => T,
  sha256: () => d,
  toBase64url: () => s,
  toBuffer: () => l,
});
function T() {
  return crypto.randomUUID();
}
function l(e) {
  return Uint8Array.from(e, (a) => a.charCodeAt(0)).buffer;
}
function O(e) {
  return String.fromCharCode(...new Uint8Array(e));
}
function m(e) {
  return e.match(/^[a-zA-Z0-9\-_]+=*$/) !== null;
}
function s(e) {
  return btoa(O(e)).replaceAll("+", "-").replaceAll("/", "_");
}
function c(e) {
  return (e = e.replaceAll("-", "+").replaceAll("_", "/")), l(atob(e));
}
async function d(e) {
  return await crypto.subtle.digest("SHA-256", e);
}
function h(e) {
  return [...new Uint8Array(e)]
    .map((a) => a.toString(16).padStart(2, "0"))
    .join("");
}
function p(e, a) {
  var t = new Uint8Array(e.byteLength + a.byteLength);
  return t.set(new Uint8Array(e), 0), t.set(new Uint8Array(a), e.byteLength), t;
}
function H() {
  return !!window.PublicKeyCredential;
}
async function A() {
  return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
}
async function R(e) {
  if (e === "local") return "platform";
  if (e === "roaming" || e === "extern") return "cross-platform";
  if (e !== "both")
    try {
      return (await A()) ? "platform" : "cross-platform";
    } catch {
      return;
    }
}
function V(e) {
  switch (e) {
    case -7:
      return "ES256";
    case -257:
      return "RS256";
    default:
      throw new Error(`Unknown algorithm code: ${e}`);
  }
}
async function v(e, a, t) {
  if (((t = t ?? {}), !m(a)))
    throw new Error("Provided challenge is not properly encoded in Base64url");
  let n = {
    challenge: c(a),
    rp: { id: window.location.hostname, name: window.location.hostname },
    user: {
      id: t.userHandle
        ? l(t.userHandle)
        : await d(new TextEncoder().encode("passwordless.id-user:" + e)),
      name: e,
      displayName: e,
    },
    pubKeyCredParams: [
      { alg: -7, type: "public-key" },
      { alg: -257, type: "public-key" },
    ],
    timeout: t.timeout ?? 6e4,
    authenticatorSelection: {
      userVerification: t.userVerification ?? "required",
      authenticatorAttachment: await R(t.authenticatorType ?? "auto"),
      residentKey: t.discoverable ?? "preferred",
      requireResidentKey: t.discoverable === "required",
    },
    attestation: t.attestation ? "direct" : "none",
  };
  t.debug && console.debug(n);
  let r = await navigator.credentials.create({ publicKey: n });
  t.debug && console.debug(r);
  let i = r.response,
    o = {
      username: e,
      credential: {
        id: r.id,
        publicKey: s(i.getPublicKey()),
        algorithm: V(r.response.getPublicKeyAlgorithm()),
      },
      authenticatorData: s(i.getAuthenticatorData()),
      clientData: s(i.clientDataJSON),
    };
  return t.attestation && (o.attestationData = s(i.attestationObject)), o;
}
async function k(e) {
  let a = ["internal"],
    t = ["hybrid", "usb", "ble", "nfc"];
  if (e === "local") return a;
  if (e == "roaming" || e === "extern") return t;
  if (e === "both") return [...a, ...t];
  try {
    return (await A()) ? a : t;
  } catch {
    return [...a, ...t];
  }
}
async function Y(e, a, t) {
  if (((t = t ?? {}), !m(a)))
    throw new Error("Provided challenge is not properly encoded in Base64url");
  let n = await k(t.authenticatorType ?? "auto"),
    r = {
      challenge: c(a),
      rpId: window.location.hostname,
      allowCredentials: e.map((f) => ({
        id: c(f),
        type: "public-key",
        transports: n,
      })),
      userVerification: t.userVerification ?? "required",
      timeout: t.timeout ?? 6e4,
    };
  t.debug && console.debug(r);
  let i = await navigator.credentials.get({
    publicKey: r,
    mediation: t.mediation,
  });
  t.debug && console.debug(i);
  let o = i.response;
  return {
    credentialId: i.id,
    authenticatorData: s(o.authenticatorData),
    clientData: s(o.clientDataJSON),
    signature: s(o.signature),
  };
}
var I = {};
b(I, {
  verifyAuthentication: () => j,
  verifyRegistration: () => _,
  verifySignature: () => U,
});
var D = {};
b(D, {
  parseAttestation: () => x,
  parseAuthentication: () => B,
  parseAuthenticator: () => C,
  parseClient: () => P,
  parseRegistration: () => S,
});
var K = {
  "9c835346-796b-4c27-8898-d6032f515cc5": { name: "Cryptnox FIDO2" },
  "c5ef55ff-ad9a-4b9f-b580-adebafe026d0": { name: "YubiKey 5Ci" },
  "39a5647e-1853-446c-a1f6-a79bae9f5bc7": {
    name: "Vancosys Android Authenticator",
  },
  "3789da91-f943-46bc-95c3-50ea2012f03a": { name: "NEOWAVE Winkeo FIDO2" },
  "fa2b99dc-9e39-4257-8f92-4a30d23c4118": { name: "YubiKey 5 Series with NFC" },
  "4e768f2c-5fab-48b3-b300-220eb487752b": { name: "Hideez Key 4 FIDO2 SDK" },
  "931327dd-c89b-406c-a81e-ed7058ef36c6": { name: "Swissbit iShield FIDO2" },
  "e1a96183-5016-4f24-b55b-e3ae23614cc6": { name: "ATKey.Pro CTAP2.0" },
  "08987058-cadc-4b81-b6e1-30de50dcbe96": {
    name: "Windows Hello Hardware Authenticator",
  },
  "d91c5288-0ef0-49b7-b8ae-21ca0aa6b3f3": {
    name: "KEY-ID FIDO2 Authenticator",
  },
  "ee041bce-25e5-4cdb-8f86-897fd6418464": {
    name: "Feitian ePass FIDO2-NFC Authenticator",
  },
  "73bb0cd4-e502-49b8-9c6f-b59445bf720b": { name: "YubiKey 5 FIPS Series" },
  "149a2021-8ef6-4133-96b8-81f8d5b7f1f5": {
    name: "Security Key by Yubico with NFC",
  },
  "3b1adb99-0dfe-46fd-90b8-7f7614a4de2a": {
    name: "GoTrust Idem Key FIDO2 Authenticator",
  },
  "f8a011f3-8c0a-4d15-8006-17111f9edc7d": { name: "Security Key by Yubico" },
  "2c0df832-92de-4be1-8412-88a8f074df4a": { name: "Feitian FIDO Smart Card" },
  "c5703116-972b-4851-a3e7-ae1259843399": { name: "NEOWAVE Badgeo FIDO2" },
  "820d89ed-d65a-409e-85cb-f73f0578f82a": {
    name: "Vancosys iOS Authenticator",
  },
  "b6ede29c-3772-412c-8a78-539c1f4c62d2": {
    name: "Feitian BioPass FIDO2 Plus Authenticator",
  },
  "85203421-48f9-4355-9bc8-8a53846e5083": { name: "YubiKey 5Ci FIPS" },
  "d821a7d4-e97c-4cb6-bd82-4237731fd4be": {
    name: "Hyper FIDO Bio Security Key",
  },
  "516d3969-5a57-5651-5958-4e7a49434167": {
    name: "SmartDisplayer BobeePass (NFC-BLE FIDO2 Authenticator)",
  },
  "b93fd961-f2e6-462f-b122-82002247de78": {
    name: "Android Authenticator with SafetyNet Attestation",
  },
  "2fc0579f-8113-47ea-b116-bb5a8db9202a": { name: "YubiKey 5 Series with NFC" },
  "9ddd1817-af5a-4672-a2b9-3e3dd95000a9": {
    name: "Windows Hello VBS Hardware Authenticator",
  },
  "d8522d9f-575b-4866-88a9-ba99fa02f35b": { name: "YubiKey Bio Series" },
  "692db549-7ae5-44d5-a1e5-dd20a493b723": { name: "HID Crescendo Key" },
  "3e22415d-7fdf-4ea4-8a0c-dd60c4249b9d": {
    name: "Feitian iePass FIDO Authenticator",
  },
  "aeb6569c-f8fb-4950-ac60-24ca2bbe2e52": { name: "HID Crescendo C2300" },
  "9f0d8150-baa5-4c00-9299-ad62c8bb4e87": {
    name: "GoTrust Idem Card FIDO2 Authenticator",
  },
  "12ded745-4bed-47d4-abaa-e713f51d6393": {
    name: "Feitian AllinOne FIDO2 Authenticator",
  },
  "88bbd2f0-342a-42e7-9729-dd158be5407a": {
    name: "Precision InnaIT Key FIDO 2 Level 2 certified",
  },
  "34f5766d-1536-4a24-9033-0e294e510fb0": {
    name: "YubiKey 5 Series CTAP2.1 Preview 1 ",
  },
  "83c47309-aabb-4108-8470-8be838b573cb": {
    name: "YubiKey Bio Series (Enterprise Profile)",
  },
  "be727034-574a-f799-5c76-0929e0430973": {
    name: "Crayonic KeyVault K1 (USB-NFC-BLE FIDO2 Authenticator)",
  },
  "b92c3f9a-c014-4056-887f-140a2501163b": { name: "Security Key by Yubico" },
  "54d9fee8-e621-4291-8b18-7157b99c5bec": { name: "HID Crescendo Enabled" },
  "6028b017-b1d4-4c02-b4b3-afcdafc96bb2": {
    name: "Windows Hello Software Authenticator",
  },
  "6d44ba9b-f6ec-2e49-b930-0c8fe920cb73": {
    name: "Security Key by Yubico with NFC",
  },
  "e416201b-afeb-41ca-a03d-2281c28322aa": { name: "ATKey.Pro CTAP2.1" },
  "9f77e279-a6e2-4d58-b700-31e5943c6a98": { name: "Hyper FIDO Pro" },
  "73402251-f2a8-4f03-873e-3cb6db604b03": { name: "uTrust FIDO2 Security Key" },
  "c1f9a0bc-1dd2-404a-b27f-8e29047a43fd": {
    name: "YubiKey 5 FIPS Series with NFC",
  },
  "504d7149-4e4c-3841-4555-55445a677357": {
    name: "WiSECURE AuthTron USB FIDO2 Authenticator",
  },
  "cb69481e-8ff7-4039-93ec-0a2729a154a8": { name: "YubiKey  5 Series" },
  "ee882879-721c-4913-9775-3dfcce97072a": { name: "YubiKey 5 Series" },
  "8c97a730-3f7b-41a6-87d6-1e9b62bda6f0": {
    name: "FT-JCOS FIDO Fingerprint Card",
  },
  "a1f52be5-dfab-4364-b51c-2bd496b14a56": {
    name: "OCTATCO EzFinger2 FIDO2 AUTHENTICATOR",
  },
  "3e078ffd-4c54-4586-8baa-a77da113aec5": { name: "Hideez Key 3 FIDO2" },
  "d41f5a69-b817-4144-a13c-9ebd6d9254d6": { name: "ATKey.Card CTAP2.0" },
  "bc2fe499-0d8e-4ffe-96f3-94a82840cf8c": {
    name: "OCTATCO EzQuant FIDO2 AUTHENTICATOR",
  },
  "1c086528-58d5-f211-823c-356786e36140": { name: "Atos CardOS FIDO2" },
  "77010bd7-212a-4fc9-b236-d2ca5e9d4084": {
    name: "Feitian BioPass FIDO2 Authenticator",
  },
  "833b721a-ff5f-4d00-bb2e-bdda3ec01e29": {
    name: "Feitian ePass FIDO2 Authenticator",
  },
};
function F(e) {
  console.debug(e);
  let a = new DataView(e.slice(32, 33)).getUint8(0);
  console.debug(a);
  let t = {
    rpIdHash: s(e.slice(0, 32)),
    flags: {
      userPresent: !!(a & 1),
      userVerified: !!(a & 4),
      backupEligibility: !!(a & 8),
      backupState: !!(a & 16),
      attestedData: !!(a & 64),
      extensionsIncluded: !!(a & 128),
    },
    counter: new DataView(e.slice(33, 37)).getUint32(0, !1),
  };
  if (e.byteLength > 37) {
    let n = $(e);
    t = { ...t, aaguid: n, name: W(n) };
  }
  return t;
}
function $(e) {
  return L(e.slice(37, 53));
}
function L(e) {
  let a = h(e);
  return (
    (a =
      a.substring(0, 8) +
      "-" +
      a.substring(8, 12) +
      "-" +
      a.substring(12, 16) +
      "-" +
      a.substring(16, 20) +
      "-" +
      a.substring(20, 32)),
    a
  );
}
function W(e) {
  return (J ?? K)[e]?.name;
}
var J = null;
var q = new TextDecoder("utf-8");
function P(e) {
  return typeof e == "string" && (e = c(e)), JSON.parse(q.decode(e));
}
function C(e) {
  return typeof e == "string" && (e = c(e)), F(e);
}
function x(e) {
  return (
    typeof e == "string" && (e = c(e)),
    "Really complex to parse. Good luck with that one!"
  );
}
function S(e) {
  return {
    username: e.username,
    credential: e.credential,
    client: P(e.clientData),
    authenticator: C(e.authenticatorData),
    attestation: e.attestationData ? x(e.attestationData) : null,
  };
}
function B(e) {
  return {
    credentialId: e.credentialId,
    client: P(e.clientData),
    authenticator: C(e.authenticatorData),
    signature: e.signature,
  };
}
async function z(e, a) {
  if (typeof e == "function") {
    let t = e(a);
    return t instanceof Promise ? await t : t;
  }
  return e === a;
}
async function g(e, a) {
  return !(await z(e, a));
}
async function _(e, a) {
  let t = S(e);
  if ((t.client.challenge, t.client.type !== "webauthn.create"))
    throw new Error(`Unexpected ClientData type: ${t.client.type}`);
  if (await g(a.origin, t.client.origin))
    throw new Error(`Unexpected ClientData origin: ${t.client.origin}`);
  if (await g(a.challenge, t.client.challenge))
    throw new Error(`Unexpected ClientData challenge: ${t.client.challenge}`);
  return t;
}
async function j(e, a, t) {
  if (e.credentialId !== a.id)
    throw new Error(`Credential ID mismatch: ${e.credentialId} vs ${a.id}`);
  if (
    !(await U({
      algorithm: a.algorithm,
      publicKey: a.publicKey,
      authenticatorData: e.authenticatorData,
      clientData: e.clientData,
      signature: e.signature,
    }))
  )
    throw new Error(`Invalid signature: ${e.signature}`);
  let r = B(e);
  if (r.client.type !== "webauthn.get")
    throw new Error(`Unexpected clientData type: ${r.client.type}`);
  if (await g(t.origin, r.client.origin))
    throw new Error(`Unexpected ClientData origin: ${r.client.origin}`);
  if (await g(t.challenge, r.client.challenge))
    throw new Error(`Unexpected ClientData challenge: ${r.client.challenge}`);
  let i = new URL(r.client.origin).hostname,
    o = s(await d(l(i)));
  if (r.authenticator.rpIdHash !== o)
    throw new Error(`Unexpected RpIdHash: ${r.authenticator.rpIdHash} vs ${o}`);
  if (!r.authenticator.flags.userPresent)
    throw new Error("Unexpected authenticator flags: missing userPresent");
  if (!r.authenticator.flags.userVerified && t.userVerified)
    throw new Error("Unexpected authenticator flags: missing userVerified");
  if (t.counter && r.authenticator.counter <= t.counter)
    throw new Error(
      `Unexpected authenticator counter: ${r.authenticator.counter} (should be > ${t.counter})`
    );
  return r;
}
function G(e) {
  switch (e) {
    case "RS256":
      return { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" };
    case "ES256":
      return { name: "ECDSA", namedCurve: "P-256", hash: "SHA-256" };
    default:
      throw new Error(
        `Unknown or unsupported crypto algorithm: ${e}. Only 'RS256' and 'ES256' are supported.`
      );
  }
}
async function Q(e, a) {
  let t = c(a);
  return crypto.subtle.importKey("spki", t, e, !1, ["verify"]);
}
async function U({
  algorithm: e,
  publicKey: a,
  authenticatorData: t,
  clientData: n,
  signature: r,
}) {
  let i = G(e),
    o = await Q(i, a);
  console.debug(o);
  let E = await d(c(n)),
    f = p(c(t), E);
  console.debug("Crypto Algo: " + JSON.stringify(i)),
    console.debug("Public key: " + a),
    console.debug("Data: " + s(f)),
    console.debug("Signature: " + r);
  let y = c(r);
  return e == "ES256" && (y = Z(y)), await crypto.subtle.verify(i, o, y, f);
}
function Z(e) {
  let a = new Uint8Array(e),
    t = a[4] === 0 ? 5 : 4,
    n = t + 32,
    r = a[n + 2] === 0 ? n + 3 : n + 2,
    i = a.slice(t, n),
    o = a.slice(r);
  return new Uint8Array([...i, ...o]);
}
var ne = { client: w, server: I, parsers: D, utils: u };
export { w as client, ne as default, D as parsers, I as server, u as utils };
//# sourceMappingURL=webauthn.min.js.map
