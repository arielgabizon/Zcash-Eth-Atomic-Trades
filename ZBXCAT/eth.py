import zXcat
# from xcat import *
from zXcat import b2x,lx
from utils import *
import sys, json
from trades import *
import argparse


def Zcash_generate(i):
    zXcat.zcashd.generate(i)

def Zcash_fund(data):
    contract = get_contract()
    p2sh = contract['p2sh']
    # amount = float(data['amt']) / zXcat.COIN
    print("amount to send", data['amt'])
    # print(data['amt'], type(data['amt']))
    fund_txid = zXcat.zcashd.sendtoaddress(p2sh,data['amt'])
    print(fund_txid)
    contract['amount'] = data['amt']
    contract['fund_tx'] = b2x(lx(b2x(fund_txid)))
    print("fund txid:",b2x(lx(b2x(fund_txid))))
    save_contract(contract)
    return contract

# finds seller's redeem tx and gets secret from it
def Zcash_get_secret():
    contract = get_contract()
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

def Zcash_redeem(data):
    print("data in redeem", data)
    contract = get_contract()
    txid = zXcat.redeem_with_secret(contract, data['preimage'])
    contract['redeem_tx'] = txid
    contract['preimage'] = data['preimage']
    save_contract(contract)
    return txid

def Zcash_new_addr(data):
    contract = {}
    addr = zXcat.new_zcash_addr()
    contract[data['role']] = str(addr)
    save_contract(contract)

def getdata():
    return get_contract()

def import_addr():
    contract = get_contract()
    zXcat.zcashd.importaddress(contract['p2sh'])

#print("in python")
if __name__ == '__main__':
    parser = argparse.ArgumentParser(formatter_class=argparse.RawTextHelpFormatter)
    parser.add_argument("command", action="store", help="next step of the zcash trade")
    parser.add_argument("-d", action="store", help="additional data")
    args = parser.parse_args()
    command = args.command
    print('command', command)
    try:
        data = args.d
        data = json.loads(data)
        print("Data in eth.py", data)
        if 'tradeid' in data:
            tradeid = args.tradeid
    except:
        print("args.d not defined", args.d)
        pass
    if command == "make":
        zXcat.make_htlc(data)
        quit()
    elif command == "getdata":
        getdata()
    elif command == "fund":
        print("data in fund", data)
        Zcash_fund(data)
    elif command == "getsecret":
        Zcash_get_secret()
    elif command == "getaddr":
        Zcash_new_addr(data)
    elif command == "redeem":
        Zcash_redeem(data)
    elif command  == "refund":
        Zcash_refund(tradeid, data)
    elif command == "import":
        import_addr()
    else:
        print("invalid choice")
