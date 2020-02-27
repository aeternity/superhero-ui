/* eslint-disable prettier/prettier */
import BigNumber from 'bignumber.js';

export const MAGNITUDE = 18;
export const MAGNITUDE_EXA = 18;
export const MAGNITUDE_GIGA = 9;
export const MAGNITUDE_MICRO = -6;
export const MAGNITUDE_PICO = -12;

export const HDWALLET_METHODS = [
  'unlockWallet',
  'generateWallet',
  'getKeypair',
  'getAccount',
  'isLoggedIn'
]

export const AEX2_METHODS = {
  CHANGE_ACCOUNT:'CHANGE_ACCOUNT',
  ADD_ACCOUNT: 'ADD_ACCOUNT',
  SWITCH_NETWORK: 'SWITCH_NETWORK',
  LOGOUT: 'LOGOUT',
  INIT_RPC_WALLET: 'INIT_RPC_WALLET'
}

export const NOTIFICATION_METHODS = {
  SWITCH_NETWORK: 'SWITCH_NETWORK'
}

const STUB_ADDRESS = 'ak_enAPooFqpTQKkhJmU47J16QZu9HbPQQPwWBVeGnzDbDnv9dxp';
const STUB_CALLDATA = 'cb_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACDJfUrsdAtW6IZtMvhp0+eVDUiQivrquyBwXrl/ujPLcgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJQQwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACUEMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJvjRF'
export const MAX_UINT256 = BigNumber(2).exponentiatedBy(256).minus(1);

export const DEFAULT_NETWORK = typeof process.env.NETWORK !== 'undefined' ? process.env.NETWORK.trim() : 'Mainnet'
export const networks = {
  Testnet: {
    url: 'https://testnet.aeternal.io',
    internalUrl: 'https://testnet.aeternal.io',
    networkId: 'ae_uat',
    middlewareUrl: 'https://testnet.aeternal.io',
    explorerUrl: 'https://testnet.aeternal.io',
    compilerUrl: 'https://latest.compiler.aepps.com',
    tipContract: "ct_YpQpntd6fi6r3VXnGW7vJiwPYtiKvutUDY35L4PiqkbKEVRqj"
  },
  Mainnet: {
    url: 'https://mainnet.aeternal.io',
    internalUrl: 'https://mainnet.aeternal.io',
    networkId: 'ae_mainnet',
    middlewareUrl: 'https://mainnet.aeternal.io/',
    explorerUrl: 'https://mainnet.aeternal.io',
    compilerUrl: 'https://compiler.aepps.com',
    tipContract: 'ct_YpQpntd6fi6r3VXnGW7vJiwPYtiKvutUDY35L4PiqkbKEVRqj'
  }
}
export const BACKEND_URL = 'https://backend.z52da5wt.xyz';
export const TIP_SERVICE = `${BACKEND_URL}/claim/submit`;

export const TIPPING_CONTRACT =
`@compiler >= 4

include "List.aes"
include "Func.aes"
include "Option.aes"

payable contract WaelletTipAnyBasic =

  record state = 
    { tips          : map(string * int, tip)
    , tips_flat     : map(string, int)
    , pay_for_tx_service : address }

  record tip = 
    { sender        : address
    , received_at   : int
    , repaid        : bool
    , amount        : int
    , note          : option(string) }
    
  datatype event = 
    TipReceived(address, int, string)
    | TipWithdrawn(address, int, string)

  entrypoint init (relayer: address) : state =
    { tips = {},
      tips_flat = {},
      pay_for_tx_service = relayer }

  payable stateful entrypoint tip (url: string, note: option(string)) : unit =
    put(state{ tips[(url, size(url))] = new_tip(url, note),
               tips_flat[url = 0] @ n = n + 1 })
    Chain.event(TipReceived(Call.caller, Call.value, url))

  entrypoint tips_for_url(url : string) = tips_by_key(url)
  entrypoint get_state() : state = state
  
  stateful entrypoint claim(url: string, pay_to : address) =
    allowed()
    let amount = aggregate_unpaid_tips(url)
    do_the_stuff(url, size(url) - 1)
    Chain.spend(pay_to, amount)
    Chain.event(TipWithdrawn(pay_to, amount, url))
    
  stateful function do_the_stuff(url, i) =
    if(i < 0) ()
    else
      put(state{ tips[(url, i)].repaid = true })
      do_the_stuff(url, i - 1)  

  entrypoint unpaid(url : string) =
    aggregate_unpaid_tips(url)
  
  function aggregate_unpaid_tips(url : string) =
    List.sum(List.map((x) => x.amount, List.filter((x) => x.repaid == false, tips_for_url(url))))
    
  function tips_by_key(key : string) =
    [ state.tips[(key, n)] | n <- [0..size(key) - 1] ]

  function size(key : string) : int = state.tips_flat[key = 0]
  
  stateful function migrate(new_contract: address) =
    allowed()
    Chain.spend(new_contract, Contract.balance)
    
  function allowed() =
    require(Call.caller == state.pay_for_tx_service, "NOT_ALLOWED")

  stateful function new_tip(url : string, note: option(string)) : tip =
    { sender        = Call.caller,
      received_at   = Chain.timestamp,
      repaid        = false,
      amount        = Call.value,
      note          = note }`
