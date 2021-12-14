import * as Yaml from "js-yaml"
import * as fs from "fs"

async function main() {
    const NETWORK:string = process.env.NETWORK || ''
    console.log(NETWORK)
    
    let templateFile: any = Yaml.load(
        fs.readFileSync("./subgraph.template.yaml", "utf8")
    )
    
    let configFile: any = Yaml.load(
        fs.readFileSync("./scripts/chainConfigs.yaml", "utf8")
    )
    
    const config = configFile.networks.find((network:any)=> network.name == NETWORK)

    templateFile.dataSources[0].source.address = config.contractAddress
    templateFile.dataSources[0].source.startBlock = config.startBlock

    const newFile = Yaml.dump(templateFile);
    fs.writeFileSync("./subgraph.yaml", newFile, "utf8");
}

main()