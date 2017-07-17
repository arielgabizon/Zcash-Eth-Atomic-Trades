import zXcat
# from xcat import *
from zXcat import b2x,lx
from utils import *
import sys, json
from trades import *

def Zcash_getaddr():
    print("test")
    return zXcat.zcashd.getnewaddress()

def Zcash_generate(i):
    zXcat.zcashd.generate(i)

def Zcash_fund(contract):
    print("in fund python")
    p2sh = contract['p2sh']
    amount = float(contract['amount'])* zXcat.COIN
    fund_txid = zXcat.zcashd.sendtoaddress(p2sh,amount)
    contract['fund_tx'] = b2x(lx(b2x(fund_txid)))
    print("fund txid:",b2x(lx(b2x(fund_txid))))
    save_contract(contract)
    return contract

def Zcash_make_contract(contract):
    contract = zXcat.make_hashtimelockcontract(contract)
    print("contract",contract)
    save_contract(contract)
    return contract

'''def Zcash_make_contract_random(funder, redeemer, hash_of_secret, lock_increment):
    contract = zXcat.make_hashtimelockcontract(funder, redeemer, hash_of_secret, lock_increment)
    return contract
'''

# finds seller's redeem tx and gets secret from it
def Zcash_get_secret(contract):
    print("In Zcash_get_secret python")
    secret = zXcat.find_secret(contract['p2sh'], contract['fund_tx'])
    print("secret found is", secret)
    contract['secret'] = secret
    save_contract(contract)
    return secret

def Zcash_refund(contract):
    contractobj = Contract(contract)
    refund_txid = zXcat.redeem_after_timelock(contractobj)
    print("refund txid is", refund_txid)
    contract['refund_txid'] = refund_txid
    save_contract(contract)
    return refund_txid

# returns txid of redeem transaction with secret
def Zcash_redeem(contract):
    print("in redeem")
    contractobj = Contract(contract)
    print(contract['secret'])
    txid = zXcat.redeem_with_secret(contractobj,get_secret())
    contract['redeem_id'] = txid
    save_contract(contract)
    return txid

print("in python")
if __name__ == '__main__':
    print("in python")
    choice = sys.argv[1]
    if choice == "0":
        Zcash_getaddr()
        quit()
# contract_file = sys.argv[2]
# print(contract_file)
print("before file open")
with open('contract.json') as data_file:
    contract = json.load(data_file)
    if choice == "make":
        print("HERE at 1")
        print(contract)
        Zcash_make_contract(contract)
        quit()
    elif choice == "fund":
        print("at 2")
        Zcash_fund(contract)
    elif choice == "getsecret":
        print("HEREE")
        Zcash_get_secret(contract)
    elif choice == "redeem":
        Zcash_redeem(contract)
    elif choice  == "refund":
        Zcash_refund(contract)
    else:
        print("invalid choice")
