**Victoria Bartolotta - 289054**

# Tarea 1 - UYArt DAO - Proyecto de staking con tokens y NFTs

## Descripción 
Este proyecto tiene como finalidad permitir a usuarios hacer staking de tokens ORT para luego poder reclamar NFTs UyArt, por cada 1000 ORT en stake, se puede reclamar 1 NFT, con un límite de 100 NFTs en total.

Los contratos fueron desarrollados en Solidity, y desplegados con Hardhat, además se testean mediante scripts locales.

## Tecnologías usadas
- Solidity 0.8.0
- Hardhat
- Ethers.js
- Node.js v20+

## Instalación

1. Clonar el repo
   ```
    git clone https://github.com/tu_usuario/Victoria-Bartolotta-289054.git
    cd Victoria-Bartolotta-289054/Tarea_1/uyart
    ```

2. Instalar dependencias
   ```
   npm install
   ````

3. Iniciar el nodo local en Hardhat
   ````
   npx hardhat node
   ````

4. En una nueva terminal desplegar, los contratos 
   ````
   npx hardhat run scripts/deploy.js --network localhost
   ````

5. Probar el flujo completo
   ````
   npx hardhat run scripts/testFlow.js --network localhost

## Deploy local

El script `scripts/deploy.js` despliega los contratos y guarda sus direcciones en `deployedAddresses.json`, que está ignorado por Git (.gitignore) para evitar conflictos entre ambientes.  
Cada vez que se haga un nuevo deploy, las direcciones cambiarán.

## Flujo de prueba (testFlow.js)
1. Owner le transfiere ORT a un usuario
2. Usuario aprueba uso de ORT al contrato de staking
3. Usuario hace stake de 3000 ORT
4. Se avanza el blockchain local 1001 bloques
5. Usuario reclama sus NFTs
6. Se imprime la cantidad de NFTs y su URI 