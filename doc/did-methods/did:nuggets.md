<p align="center">
  <img src="https://nuggets-public-assets.s3.eu-west-1.amazonaws.com/nuggets-horizontal.png" alt="Nuggets Logo"/>
</p>

# Nuggets DID Method

**Authors**
  - [Andrew Lord](https://github.com/amlord) ([Nuggets Ltd](https://nuggets.life/))

---

## Abstract

The Nuggets [DID Method](https://w3c.github.io/did-core/#methods) is intended for use with accounts created on the Nuggets Network. The intention is to allow interoperability with users from other systems supporting DIDs, whilst maintaining a high level or security and privacy for users.

[Nuggets](https://nuggets.life/) is a Self-Sovereign verified digital identity and payment platform. Our main focus is on security and privacy of user's data. As such, Nuggets has no access to any of the user data stored on our systems.

## Status of This Document

*Disclaimer*: This document is a draft and the information contained herein is subject to change.

## Introduction

[Nuggets](https://nuggets.life/) is an e-commerce payments and ID platform. It stores user's personal and payment data securely; data is end-to-end encrypted, so not even Nuggets can see the data passing through & stored on our systems.

Users decide if and when they want to share their data, and do so on their own terms.

The `did:nuggets:` [DID Method](https://w3c.github.io/did-core/#methods) is used to resolve the DID Documents for partners on the Nuggets system, so that users can securely interact with other parties on the system via encryption, signing & verification of data.

## DID Scheme

The [DID Scheme](https://w3c.github.io/did-core/#dfn-did-schemes) for Nuggets is defined as:
```sh
did:nuggets:
```

## Method Specific ID
The `method-specific-id` component of a Nuggets DID maps to a single account on the Nuggets network.

Nuggets uses a private Ethereum network as a ledger for management of user accounts. This means that each account no the Nuggets network is identified by a unique Ethereum address. The `method-specific-id` is a Base58* representation of this Ethereum address.

So, an Ethereum account with the address of: `0x47dCBa7a9a102338D3dA1198662e138D11185149` would map to a DID of:

```sh
did:nuggets:214udHLePZCeS3QvPczZwk88gwEQ
```

Where `0x47dCBa7a9a102338D3dA1198662e138D11185149` is the hexadecimal address represenatation, and `214udHLePZCeS3QvPczZwk88gwEQ` is the Base58* representation.

*Note*: *The Base 58 representation mentioned here is the Bitcoin version of the [Base 58 encoding scheme](https://tools.ietf.org/id/draft-msporny-base58-01.html).

## CRUD Operations
The method supports the following operations:

### Create
### Read
### Update
### Deactivate (Delete)

## Security Considerations

## Privacy Considerations

