import hashlib
import json
import random
import binascii
import trades
import os

root_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
xcat_dir = os.path.join(root_dir, 'ZBXCAT')

def hex2str(hexstring):
    return binascii.unhexlify(hexstring).decode('utf-8')

def sha256(secret):
    preimage =  secret.encode('utf8')
    h = hashlib.sha256(preimage).digest()
    return h

def generate_password():
    s = "abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    passlen = 8
    p =  "".join(random.sample(s,passlen))
    return p

# TODO: Port these over to leveldb or some other database
def save_trade(trade):
    with open('xcat.json', 'w') as outfile:
        json.dump(trade, outfile)

def get_trade():
    with open('xcat.json') as data_file:
    # try:
        xcatdb = json.load(data_file)
        sellContract = trades.Contract(xcatdb['sell'])
        buyContract = trades.Contract(xcatdb['buy'])
        trade = trades.Trade(sellContract,buyContract)

        # trade.buyContract = xcatdb['buy']
        return trade
    # except:
    #    print("HHHEERREE")
    #    return None

def erase_trade():
    with open('xcat.json', 'w') as outfile:
        outfile.write('')



def get_contract():
    path = os.path.join(xcat_dir, 'contract.json')
    with open(path) as data_file:
        data = json.load(data_file)
        return data

# used in Eth xcat
def save_contract(contract):
    path = os.path.join(xcat_dir, 'contract.json')
    with open(path, 'w') as outfile:
        json.dump(contract, outfile)

# caching the secret locally for now...
def get_secret():
    path = os.path.join(xcat_dir, 'secret.json')
    with open(path) as data_file:
        for line in data_file:
                return line.strip('\n')

def save_secret(secret):
    path = os.path.join(xcat_dir, 'secret.json')
    with open(path, 'w') as outfile:
        outfile.write(secret)

def save(trade):
    print("Saving trade")
    trade = {
    'sell': trade.sellContract.__dict__,
    'buy': trade.buyContract.__dict__
    }
    save_trade(trade)
