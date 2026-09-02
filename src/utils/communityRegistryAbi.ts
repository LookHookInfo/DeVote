export const communityRegistryAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "avatarUrl",
        "type": "string"
      }
    ],
    "name": "ProfileUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getProfile",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "avatarUrl",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "twitter",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "debank",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "linkedin",
            "type": "string"
          }
        ],
        "internalType": "struct OgCommunityRegistry.Profile",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_avatarUrl",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_twitter",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_debank",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_linkedin",
        "type": "string"
      }
    ],
    "name": "setProfile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
