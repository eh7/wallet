my $sol_file = $ARGV[0];
my $sol_contract_name = $ARGV[1];

if($sol_contract_name eq "") {
  print "USAGE: $0 <solidity_file_path> <Contract Name>\n";
  exit(1);
}

my $sol_contract_filename = $sol_file;
$sol_contract_filename =~ s/^.*\/(.*)$/$1/;

#print "$sol_file :: $sol_contract_name\n";
#print "$sol_contract_filename\n";

my $js_file = "js/deploy.".$sol_contract_name.".js";
my $js_init_file = "js/init.".$sol_contract_name.".js";

my $account_name = "eth.accounts[0]";

my $pwd = `pwd`;
chomp($pwd);

my $solcOutput = `solc --optimize --combined-json abi,bin,interface $sol_file`;
chomp($solcOutput);

open(OUT,">".$js_file);
print OUT <<EOF;

var solcOutput = $solcOutput;

var Contract = web3.eth.contract(JSON.parse(solcOutput.contracts["$sol_file:$sol_contract_name"].abi));

personal.unlockAccount($account_name);

var $sol_contract_name = Contract.new({ from: $account_name, data: "0x" + solcOutput.contracts["$sol_file:$sol_contract_name"].bin, gas: 2000000},
  function (e, contract) {
    if(!e) {  
      if(!contract.address) {
        console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
      } else {
        console.log("Contract mined! Address: " + contract.address);
        console.log(contract);
      } 
    }
  }
);

EOF
close(OUT);

print <<EOF;
Run the following in geth;

loadScript("$pwd/$js_file")

EOF

print "Then Enter returned contract address: ";
my $address = <STDIN>;
chomp($address);


open(OUT,">".$js_init_file);
print OUT <<EOF;

var solcOutput = $solcOutput;

abi = JSON.parse(solcOutput.contracts["$sol_file:$sol_contract_name"].abi);

address = '$address';

var $sol_contract_name = web3.eth.contract(abi).at(address);

var event = $sol_contract_name.allEvents();
event.watch(function(error, result){
  if (!error)
  {
    str = JSON.stringify(result)
    console.log(str);
  }
});


EOF
close(OUT);
