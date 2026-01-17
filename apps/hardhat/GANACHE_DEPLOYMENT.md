# Guía de Despliegue en Ganache

# ================================

Este documento explica cómo desplegar los contratos de Lottery en Ganache (red local de desarrollo).

## Requisitos Previos

1. **Ganache instalado**: Puedes usar Ganache GUI o Ganache CLI

   - Ganache GUI: https://trufflesuite.com/ganache/
   - Ganache CLI: `npm install -g ganache`

2. **Puerto configurado**:
   - Ganache GUI: Puerto 7545 (por defecto)
   - Ganache CLI: Puerto 8545 (por defecto)

## Configuración

### Paso 1: Configurar variables de entorno

Crea un archivo `.env` en el directorio `apps/hardhat/` con el siguiente contenido:

```bash
# Para Ganache GUI (puerto 7545)
RPC_GANACHE="http://127.0.0.1:7545"
CHAIN_ID_GANACHE=1337

# Para Ganache CLI (puerto 8545)
# RPC_GANACHE="http://127.0.0.1:8545"
# CHAIN_ID_GANACHE=1337

# Opcional: Puedes dejar vacío para usar las cuentas de Ganache automáticamente
MNEMONIC=""
```

### Paso 2: Iniciar Ganache

**Opción A - Ganache GUI:**

1. Abre la aplicación Ganache
2. Crea un nuevo workspace o usa "Quickstart"
3. Verifica que esté corriendo en el puerto 7545

**Opción B - Ganache CLI:**

```bash
ganache --port 8545 --chainId 1337
```

## Scripts Disponibles

### Desplegar SOLO contrato de Lottery

```bash
npm run deploy:lottery:ganache
```

Este comando:

- ✅ Compila los contratos
- ✅ Despliega el contrato Lottery en Ganache
- ✅ Despliega automáticamente los contratos NFT internos
- ✅ Copia los ABIs al frontend
- ✅ Guarda las direcciones en `deployments.json`

### Desplegar TODOS los contratos (Lottery + DeFi)

```bash
npm run deploy:ganache
```

Este comando despliega todos los contratos del proyecto.

## Verificar el Despliegue

Después del despliegue exitoso verás algo como:

```
🎰 Deploying Lottery Contract
────────────────────────────────────────
Network: ganache
Deployer: 0x1234...5678
────────────────────────────────────────

⏳ Deploying Lottery...
✅ Lottery deployed: 0xabcd...ef01
✅ mainERC721 NFT deployed: 0x2345...6789

📋 DEPLOYMENT SUMMARY
────────────────────────────────────────
Lottery: 0xabcd...ef01
LotteryNFT: 0x2345...6789
────────────────────────────────────────
```

## Actualizar el Frontend

Las direcciones de los contratos se copian automáticamente a:

- `deployments.json`
- ABIs se copian a `apps/frontend/src/abis/`

**IMPORTANTE**: Actualiza tu `.env` del frontend con la dirección del contrato Lottery:

```bash
# apps/frontend/.env
NEXT_PUBLIC_LOTTERY_ADDRESS=0xabcd...ef01  # La dirección que aparece en la consola
```

## Troubleshooting

### Error: "Cannot connect to network"

- Verifica que Ganache esté corriendo
- Verifica el puerto en `.env` (7545 para GUI, 8545 para CLI)

### Error: "Insufficient funds"

- Ganache provee 100 ETH por cuenta automáticamente
- Verifica que estés usando la primera cuenta de Ganache

### Error: "Network ganache not found"

- Verifica que el archivo `.env` existe y tiene `RPC_GANACHE` configurado

### Redesplegar contratos

Si quieres redesplegar (por ejemplo, después de cambios en el código):

1. **Opción A** - Eliminar entrada en deployments.json:

   ```bash
   # Edita apps/hardhat/deployments.json y elimina la sección "ganache"
   ```

2. **Opción B** - Reiniciar Ganache:
   - Esto resetea completamente la blockchain local
   - Luego ejecuta el script de deploy nuevamente

## Testing en Ganache

```bash
# Ejecutar tests
npm run test

# Ejecutar tests contra red local
npm run test:local
```

## Ventajas de Ganache

✅ Transacciones instantáneas (sin esperar confirmaciones)
✅ 100 ETH por cuenta (no necesitas faucets)
✅ Reset rápido de la blockchain
✅ Interfaz visual para ver transacciones (GUI)
✅ Sin costos de gas reales
✅ Ideal para desarrollo y debugging

## Próximos Pasos

1. ✅ Desplegar en Ganache
2. ⏭️ Probar en el frontend (http://localhost:3000)
3. ⏭️ Realizar transacciones de prueba
4. ⏭️ Cuando esté listo, desplegar en testnet (Polygon Amoy o Sepolia)

---

**Comando rápido para empezar:**

```bash
# 1. Inicia Ganache
ganache --port 7545 --chainId 1337

# 2. En otra terminal, despliega
cd apps/hardhat
npm run deploy:lottery:ganache

# 3. Actualiza el frontend con la dirección
echo "NEXT_PUBLIC_LOTTERY_ADDRESS=<dirección_del_contrato>" >> apps/frontend/.env

# 4. Inicia el frontend
cd apps/frontend
npm run dev
```
