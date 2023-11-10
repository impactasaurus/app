import { decode, encode } from "thirty-two";

// For single beneficiary summons, the first component of the ID
// is a base 32 (without padding) encoded beneficiary ID. The remaining components
// are the Summon ID

// throws an error if decoding fails
export const Decode = (smn: string): { id: string; ben?: string } => {
  const guidParts = smn.split("-");
  const idIncludesBen = guidParts.length === 6;
  if (idIncludesBen) {
    let benEnc = guidParts[0];
    while (benEnc.length % 8 !== 0) {
      benEnc += "=";
    }
    return {
      id: guidParts.slice(1).join("-"),
      ben: decode(benEnc).toString(),
    };
  }
  return {
    id: smn,
  };
};

export const Encode = (id: string, ben?: string): string => {
  if (ben) {
    return `${encode(ben).toString().toLowerCase().replaceAll("=", "")}-${id}`;
  }
  return id;
};
