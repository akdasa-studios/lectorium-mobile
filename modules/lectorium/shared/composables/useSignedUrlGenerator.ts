import { SignedUrlGenerator, useConfig } from "@lectorium/shared"

export function useSignedUrlGenerator() {
  const config = useConfig()
  const signedUrlGenerator = new SignedUrlGenerator(config.serverBaseUrl.value)
  return signedUrlGenerator
}