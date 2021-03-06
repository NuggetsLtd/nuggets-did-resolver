<p align="center">
  <img src="https://nuggets-public-assets.s3.eu-west-1.amazonaws.com/nuggets-horizontal.png" alt="Nuggets Logo"/>
</p>

# Nuggets DID Method

**Authors**
  - [Alastair Johnson](https://github.com/Alastairij) ([Nuggets Ltd](https://nuggets.life/))
  - [Andrew Lord](https://github.com/amlord) ([Nuggets Ltd](https://nuggets.life/))
  - [Emmanuel Acheampong](https://github.com/MannyA2k) ([Nuggets Ltd](https://nuggets.life/))

---

## Abstract

The Nuggets [DID Method](https://w3c.github.io/did-core/#methods) is intended for use with accounts created on the Nuggets Network. The intention is to allow interoperability with users from other systems supporting DIDs, whilst maintaining a high level of security and privacy for users.

[Nuggets](https://nuggets.life/) is a Self-Sovereign verified digital identity and payment platform. Our main focus is on security and privacy of user's data. As such, Nuggets has no access to any of the user data stored on our systems.

## Status of This Document

*Disclaimer*: This document is a draft and the information contained herein is subject to change.

## Introduction

[Nuggets](https://nuggets.life/) delivers trusted transactions through verified digital identities for every transaction. 

Nuggets is a Self-Sovereign, verified digital identity and payment platform. It enables trusted transactions through verified digital identities, a personal cloud vault, and auditable nuggets of data. 

Personal and payment data is owned and controlled by the user.

Users decide if and when they want to share their data, and do so on their own terms.

The Nuggets [DID Method](https://w3c.github.io/did-core/#methods) is used to resolve the DID Documents for partners on the Nuggets system, so that users can securely interact with other parties on the system via encryption, signing & verification of data.

## DID Scheme

The [DID Scheme](https://w3c.github.io/did-core/#dfn-did-schemes) for Nuggets is defined as:
```sh
did:nuggets:
```

## Method Specific ID
The `method-specific-id` component of a Nuggets DID maps to a single account on the Nuggets network.

Nuggets uses a private Ethereum network as a ledger for management of user accounts. This means that each account on the Nuggets network is identified by a unique Ethereum address. The `method-specific-id` is a Base58* representation of this Ethereum address.

So, an Ethereum account with the address of: `0x47dCBa7a9a102338D3dA1198662e138D11185149` would map to a DID of:

```sh
did:nuggets:214udHLePZCeS3QvPczZwk88gwEQ
```

Where `0x47dCBa7a9a102338D3dA1198662e138D11185149` is the hexadecimal address represenatation, and `214udHLePZCeS3QvPczZwk88gwEQ` is the Base58* representation.

*Note*: *The Base 58 representation mentioned here is the Bitcoin version of the [Base 58 encoding scheme](https://tools.ietf.org/id/draft-msporny-base58-01.html).

## CRUD Operations

Due to DIDs on Nuggets being linked to the underlying user (Ethereum) account, the DID Method operations are linked to the operations for creating, reading, updating and deletion of accounts on the system.

### Create
End users interact with the Nuggets system predominantly by means of a mobile app, available on both iOS and Android:

- [iOS](https://apps.apple.com/gb/app/nuggets-pay-id/id1216139887)
- [Andriod](https://play.google.com/store/apps/details?id=life.nuggets.app)

When a user first opens the app, a random [BIP-39 Mnemonic](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) is generated, which then is used for the generation of a HD (hierarchical deterministic) wallet.

This wallet is then used to derive a [DPKI](https://hackernoon.com/decentralized-public-key-infrastructure-dpki-what-is-it-and-why-does-it-matter-babee9d88579) keypair for the [DID Controller](https://w3c.github.io/did-core/#dfn-did-controllers) of the account.

In order for a user to be validated on the Nuggets system, they must then pass through the in-app onboarding KYC process. The output of this process is a verifiable credential with the proven information, which the user then uses to register an account on the network.

Once a user has registered, they will then be able to generate a DID Document with their public keys and service endpoints for sharing with other parties. These DID Documents can either be published publicly, or exchanged over private channels.

Due to the fact that the user has an HD Wallet, there is the option to derive child accounts for interaction with third parties, where nothing about this account would be written to the ledger, but expressly for peer to peer connections. So, a user could generate a new DID Document for each party that it interacts with (or even each interaction), eliminating the potential for correlation of accounts.

### Read

A registered DID may be resolved to the corresponding DID Document by means of an HTTP GET request to `https://api-dev.internal-nuggets.life/api/v1/nugget/{ethereum_address}/did`, for example:
```sh
https://api-dev.internal-nuggets.life/api/v1/nugget/0xd2339bA4AfBF83C1A4a7F682AE962446b7DA8292/did
```

Example successful response structure:
```json
{
  "success": true,
  "data": {
    "@context": [
      "https://www.w3.org/ns/did/v1/",
      "https://w3id.org/security/v2",
      "https://w3id.org/security/suites/secp256k1-2019/v1"
    ],
    "id": "did:nuggets:3vrLyshBQ8TrJJ2FcNHbm2kzahhB",
    "verificationMethod": [
      {
      "id": "did:nuggets:3vrLyshBQ8TrJJ2FcNHbm2kzahhB#controller",
      "type": "EcdsaSecp256k1VerificationKey2019",
      "controller": "did:nuggets:3vrLyshBQ8TrJJ2FcNHbm2kzahhB",
      "publicKeyBase58": "5XPH5TZv5XeUUzd4sXw7NNCzQL7DN1vqGKgzBs3DBLnhBGTNxRaYtaeVpTJYnaunrsoGyZh95CiYq9rr3zFCkD9F"
      },
      {
      "type": "Bls12381G2Key2020",
      "id": "did:nuggets:3vrLyshBQ8TrJJ2FcNHbm2kzahhB#bls12381g2",
      "controller": "did:nuggets:3vrLyshBQ8TrJJ2FcNHbm2kzahhB",
      "publicKeyBase58": "nbvXR5XYQ9sApPWAgeqXngFtDZgbqX36hiJffnsLsbkNmkSoj1i6RMb1CbgR9Cx9mGD7MG7whnR3ymj5A9GA2xzqEUuYoXNGKGVqTGmVWdNQ6bvA9oLg9m6efh9Hc6fBZsi"
      }
    ],
    "authentication": [
      "did:nuggets:3vrLyshBQ8TrJJ2FcNHbm2kzahhB#controller"
    ],
    "assertionMethod": [
      "did:nuggets:3vrLyshBQ8TrJJ2FcNHbm2kzahhB#bls12381g2"
    ]
  }
}
```

### Update
DID Documents can be updated by the DID Controller, but this will only happen in the following circumstances:

- Key addition
- Key rotation
- Service endpoint update

### Deactivate (Delete)
Users are able to delete their account via the Nuggets app. Upon doing this, all data related to their account will be deleted from the Nuggets systems. This includes published DID Documents.

Once an account has been deleted on the Nuggets system, it is no longer able to be recovered.

## Security Considerations

- All communication must use HTTPS with TLS 1.2 or greater with a forward secret cipher
- Where a key compromise is identified, the DID Controller **MUST** either:
    - rotate out the compromised key
    - delete the user account (and associated DID)
- DID Controller developers **MUST**:
    - frequently scan for third party package vulnerabilities
    - undertake periodic security audits by external third parties
    - store all private keys & secrets securely (for example; using the keychain in iOS)
    - use certificate pinning to prevent man-in-the-middle attacks
    - ensure that the application architecture is secure
    - share sensitive information (for example via; [DIDComm Messaging](https://identity.foundation/didcomm-messaging/spec/))
      - through TLS and JWE encryption
      - via a mediator(s) to provide herd privacy and mitigate surveillance between parties
    - take steps to detect jailbroken / rooted mobile devices:
      - users should be informed of the risks, or prevented from running the application
    - ensure App Transport Security (ATS) is turned on (iOS devices)
    - ensure automatic reference counting (ARC) is enabled (iOS devices)
    - implement code tamper detection (Android devices)
- DID Controller developers **MUST NOT**:
    - release a package containing known exploitable vulnerabilities
    - use logging software to write to external services 
      - due to potential for [personal identifiable information](https://gdpr.eu/eu-gdpr-personal-data/) (PII) data exposure
    - include secrets in application code
- DID Controller developers **SHOULD**:
  - be aware of OWASP [Mobile](https://github.com/OWASP/owasp-mstg/tree/master/Checklists) and [Web](https://github.com/OWASP/wstg) testing guides
  - only support strong cipher suites
  - implement rate limiting & caching measures to ensure not to overload the platform
  - take steps to prevent sending of unsolicited messages to other parties
- DID Controller developers **SHOULD NOT**:
  - re-use cryptographic keys for multiple purposes

## Privacy Considerations

API endpoints for the *Nuggets Network* are maintained and managed by Nuggets Ltd. Nuggets has from the start been focussed on users "taking back control" of their data, by means of Self-Sovereign Identity.

Great care has been taken to ensure that no-one in the network has access to any information about a user, unless a user has specifically shared it with them (not even maintainers of the network itself).

In practice, this means:

- Nuggets has no access to any user data
- All data *passed via* the Nuggets Network is encrypted by the user for the intended recipient only
- All data *stored on* the Nuggets Network is encrypted by the user for their own retrieval & use
  - the only exception to this is the public DID Documents for Nuggets partners, which need to be discoverable
- For KYC checks;
  - A scan of the user's identity document is captured on their device, along with a live video of the user for comparision. This is exchanged directly with the KYC provider, and is required for KYC verification of the user
  - Agreements are in place with the KYC provider that they will not keep records of any data or transactions
  - The KYC provider generates a verifiable credential for the user with OCR data from their identity document, which they can then use to prove various information about themselves to other parties
  - An account is created on the Nuggets Network by a user providing a *zero-knowledge proof* of a KYC check. No [personal identifiable information](https://gdpr.eu/eu-gdpr-personal-data/) (PII) data is passed to the API endpoint
- Partners on the *Nuggets Network* must adhere to stringent rules about how they treat data that a user has shared with them
- Transactional data can only be stored about a given transaction for *regulatory purposes*. The data in this case is encrypted for only the partner & user interacting, and will be stamped with a specific time of expiry upon storage
- A user is always given clear information asto why & with whom each piece data is to be shared. It will then only be be shared with the express approval of the user
- Server logs on the Nuggets Network are solely for issue resolution, data flow monitoring & data management
- The Nuggets Network is regularly audited by third party security companies
- At any point in time, a user can remove their account from the Nuggets Network. All data associated to that user will be removed from the network.
  - The only exception to this is data stored for *regulatory purposes*, which will remain in place until the agree upon expiry date

Nuggets Ltd provides a user agent for interacting with the Nuggets Network. This agent acts as the DID Controlle, and as such, follows these rules:

For DID Method implementation, the DID Controller **MUST**:
- protect integrity and confidentiality of user [personal identifiable information](https://gdpr.eu/eu-gdpr-personal-data/) (PII) data
- comply with all applicable privacy and data protection laws, regulations and principles
- ensure that necessary security controls are in place to protect user PII data

For DID Method implementation, the DID Controller **MUST NOT**:
- store PII in a DID document
- write PII data to any system or application log
- store any PII data in temporary memory
