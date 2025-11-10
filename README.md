# Recklion DApp DeFi de Staking

> **Autor:** Ariel Duarte  
> **Año:** 2025

---

## 📖 ¿Qué es este proyecto?

Imaginate que tenés una alcancía mágica: cuando ponés tus monedas adentro, esa alcancía te regala más monedas como premio por guardarlas ahí. **Eso es exactamente lo que hace este proyecto, pero con criptomonedas en internet.**

Este es un proyecto completo de **DeFi (Finanzas Descentralizadas)** donde los usuarios pueden:

- 💰 **Hacer Staking** (guardar sus tokens DAMC)
- 🎁 **Recibir Recompensas** (ganar tokens REY como premio)
- 💸 **Retirar sus tokens** cuando quieran
- 👀 **Ver su balance** en tiempo real conectando su wallet de MetaMask

Todo funciona en la **red blockchain de Polygon Amoy** (una red de prueba gratuita) y está construido con tecnologías modernas y seguras.

---

## 🏗️ Arquitectura del Proyecto

Este proyecto es un **monorepo**, lo que significa que es como una casa con dos pisos:

```
📦 recklion-next-hardhat2-DApp01/
├── 📁 apps/
│   ├── 🔨 hardhat/          ← Piso 1: Los contratos inteligentes (backend blockchain)
│   └── 🎨 frontend/         ← Piso 2: La interfaz web (lo que ven los usuarios)
└── 📄 package.json          ← El archivo que conecta ambos pisos
```

### 🔨 Piso 1: Hardhat (Backend Blockchain)

**Hardhat** es como una fábrica donde construimos y probamos los contratos inteligentes antes de ponerlos en la blockchain.

**Tecnologías usadas:**

- **Hardhat v2.27.0** - El entorno de desarrollo para Solidity
- **Solidity v0.8.4** - El lenguaje de programación para escribir contratos
- **Ethers.js v6.15.0** - La biblioteca para interactuar con la blockchain
- **TypeScript** - Para escribir código más seguro y claro

**Archivos importantes:**

- `contracts/` - Donde viven los 3 contratos inteligentes
- `scripts/deploy.ts` - El script que sube los contratos a la blockchain
- `hardhat.config.ts` - La configuración de redes y compilador

### 🎨 Piso 2: Frontend (Interfaz Web)

El frontend es la parte bonita que los usuarios ven en su navegador, donde pueden hacer clic en botones y ver sus balances.

**Tecnologías usadas:**

- **Next.js v16.0.1** - Framework de React para crear la aplicación web
- **React v19.2.0** - Biblioteca para construir interfaces de usuario
- **Wagmi v2.19.2** - La biblioteca mágica que conecta React con blockchain
- **RainbowKit v2.2.9** - Los botones lindos para conectar wallets (MetaMask)
- **Viem v2.38.6** - Biblioteca moderna para interactuar con Ethereum
- **HeroUI v2.8.5** - Componentes de interfaz elegantes y modernos
- **Tailwind CSS v3.4** - Para hacer que todo se vea bonito
- **TanStack Query v5** - Para manejar los datos de la blockchain

---

## 🎯 Los 3 Contratos Inteligentes

### 1. 🪙 DamcStakedToken (DAMC)

**¿Qué hace?** Es el token que los usuarios van a "guardar" en el contrato para hacer staking.

**Características:**

- Nombre: **DamC Token**
- Símbolo: **DAMC**
- Total Supply: **1,000,000 tokens**
- Decimales: **18** (como Ether)
- Es un token **ERC-20** estándar

**Funciones principales:**

- `transfer()` - Enviar tokens a otra persona
- `approve()` - Dar permiso a otro contrato para usar tus tokens
- `transferFrom()` - Permitir que otro contrato mueva tus tokens

**Ubicación:** `apps/hardhat/contracts/DamcStakedToken.sol`

---

### 2. 👑 ReyRewardToken (REY)

**¿Qué hace?** Es el token de recompensa que los usuarios reciben como premio por hacer staking.

**Características:**

- Nombre: **Rey Token**
- Símbolo: **REY**
- Total Supply: **1,000,000 tokens**
- Decimales: **18**
- También es un token **ERC-20** estándar

**Funciones principales:**

- `transfer()` - Enviar tokens de recompensa
- `approve()` - Dar permisos de gasto
- `transferFrom()` - Mover tokens con permiso

**Ubicación:** `apps/hardhat/contracts/ReyRewardToken.sol`

---

### 3. 👨‍🍳 MasterChefToken (El Jefe del Staking)

**¿Qué hace?** Es el contrato principal, el "jefe" que maneja todo el sistema de staking. Es como el dueño de la alcancía mágica.

**Características:**

- Nombre: **Master Chef Token**
- Gestiona quién hace staking y cuánto
- Distribuye recompensas a los stakers
- Solo el **owner** puede emitir recompensas

**Estructuras de datos:**

```solidity
address[] public stakers;                      // Lista de todos los stakers
mapping(address => uint) public stakingBalance; // Cuánto tiene cada uno en staking
mapping(address => bool) public hasStaked;     // Si alguna vez hizo staking
mapping(address => bool) public isStaking;     // Si está haciendo staking ahora
```

**Funciones principales:**

#### 📥 `stakeTokens(uint _amount)`

Permite a los usuarios "guardar" sus tokens DAMC en el contrato.

**¿Qué hace?**

1. Verifica que la cantidad sea mayor a 0
2. Transfiere los tokens DAMC del usuario al contrato
3. Actualiza el balance de staking del usuario
4. Agrega al usuario a la lista de stakers (si es la primera vez)
5. Marca al usuario como "haciendo staking"

**Ejemplo de uso:**

```javascript
// El usuario guarda 100 tokens DAMC
stakeTokens(100);
```

#### 📤 `unstakeTokens()`

Permite a los usuarios retirar todos sus tokens DAMC del staking.

**¿Qué hace?**

1. Verifica que el usuario tenga balance de staking
2. Transfiere todos los tokens DAMC de vuelta al usuario
3. Resetea el balance de staking a 0
4. Marca al usuario como "no haciendo staking"

**Ejemplo de uso:**

```javascript
// El usuario retira todos sus tokens DAMC
unstakeTokens();
```

#### 🎁 `issueTokens()`

Permite al **owner** distribuir recompensas REY a todos los stakers.

**¿Qué hace?**

1. Verifica que quien llama sea el owner
2. Recorre la lista de todos los stakers
3. Para cada staker con balance > 0, envía tokens REY como recompensa
4. La cantidad de REY es proporcional a su balance de staking

**Ejemplo de uso:**

```javascript
// El owner distribuye recompensas
issueTokens();
```

**Ubicación:** `apps/hardhat/contracts/MasterChefToken.sol`

---

## 🌐 Red Blockchain: Polygon Amoy

**¿Qué es Polygon Amoy?**

Es una red de prueba (testnet) de Polygon. Imaginate que es como un "parque de diversiones de práctica" donde podés probar tu aplicación sin gastar dinero real.

**Características:**

- ⚡ **Rápida** - Las transacciones se confirman en segundos
- 🆓 **Gratuita** - Los tokens de prueba son gratis
- 🔗 **Compatible con Ethereum** - Usa las mismas herramientas
- Chain ID: **80002**

**¿Cómo conseguir tokens de prueba?**

1. Andá a un faucet de Polygon Amoy
2. Ingresá tu dirección de wallet
3. Recibí tokens MATIC gratis para pagar las transacciones

---

## 🔧 Cómo Desplegar los Contratos

### Paso 1: Configurar el Entorno

Primero, creá un archivo `.env` en `apps/hardhat/`:

```bash
# Tu frase semilla de 12 palabras de MetaMask
MNEMONIC="tu frase semilla de 12 palabras aqui"

# URL del RPC de Polygon Amoy (puedes usar Infura o Alchemy)
RPC_AMOY="https://rpc-amoy.polygon.technology"
```

### Paso 2: Instalar Dependencias

Desde la raíz del proyecto:

```bash
# Instalar todas las dependencias del monorepo
npm install
```

### Paso 3: Compilar los Contratos

```bash
# Ir a la carpeta de hardhat
cd apps/hardhat

# Compilar los contratos
npm run compile
```

Esto genera:

- Los **ABIs** (Application Binary Interface) en `artifacts/`
- Los **bytecodes** necesarios para el despliegue

### Paso 4: Desplegar en Polygon Amoy

```bash
# Desplegar en Polygon Amoy y copiar los ABIs al frontend
npm run deploy:amoy
```

**¿Qué hace este comando?**

1. Compila los contratos
2. Ejecuta el script `scripts/deploy.ts`
3. Despliega los 3 contratos en orden:
   - Primero **DamcStakedToken**
   - Segundo **ReyRewardToken**
   - Tercero **MasterChefToken** (recibe las direcciones de los otros dos)
4. Copia los ABIs a `apps/frontend/src/abis/` para que el frontend los use

**Salida esperada:**

```
Deploying with: 0x123...abc
✅ Damc: 0xABC123...
✅ Rey : 0xDEF456...
✅ Chef: 0xGHI789...
```

### Paso 5: Guardar las Direcciones

Copiá las direcciones de los contratos y crealas en `apps/frontend/.env.local`:

```bash
NEXT_PUBLIC_DAMC_ADDRESS="0xABC123..."
NEXT_PUBLIC_REY_ADDRESS="0xDEF456..."
NEXT_PUBLIC_CHEF_ADDRESS="0xGHI789..."
```

---

## 🎨 Frontend: La Interfaz de Usuario

### Estructura del Frontend

```
apps/frontend/
├── src/
│   ├── app/                    ← Páginas y layouts (Next.js 16 App Router)
│   │   ├── layout.tsx         ← Layout principal con tema dark
│   │   ├── providers.tsx      ← Providers de Web3 (Wagmi + RainbowKit)
│   │   └── globals.css        ← Estilos globales de Tailwind
│   ├── components/
│   │   └── defi/              ← Componentes del DeFi
│   │       ├── IssueRewards.tsx        ← Emitir recompensas (solo owner)
│   │       ├── ClaimTestTokens.tsx     ← Obtener tokens de prueba
│   │       ├── FundMasterChef.tsx      ← Fondear el contrato con REY
│   │       ├── TransferStakeToken.tsx  ← Transferir DAMC
│   │       └── TransferTokenFarm.tsx   ← Stake/Unstake de DAMC
│   ├── abis/                  ← ABIs de los contratos (JSON)
│   │   ├── DamcStakedToken.json
│   │   ├── ReyRewardToken.json
│   │   └── MasterChefToken.json
│   └── wagmi.ts               ← Configuración de Wagmi y chains
├── tailwind.config.js         ← Configuración de Tailwind CSS
└── package.json
```

### 🔌 Conexión a la Blockchain: El Stack Web3

Para conectar el frontend con la blockchain, usamos un "stack" de librerías que trabajan juntas:

#### 1. **Wagmi v2** - El Cerebro

**¿Qué hace?** Es como un traductor que permite que tu app React "hable" con la blockchain.

**Hooks principales que usamos:**

- `useAccount()` - Obtener la wallet conectada
- `useReadContract()` - Leer datos de los contratos
- `useWriteContract()` - Escribir en los contratos (transacciones)
- `useWaitForTransactionReceipt()` - Esperar confirmación de transacciones

**Ejemplo de uso:**

```typescript
const { address, isConnected } = useAccount();

const { data: balance } = useReadContract({
  address: damcAddress,
  abi: DamcABI,
  functionName: "balanceOf",
  args: [address],
});
```

#### 2. **Viem v2** - El Ayudante

**¿Qué hace?** Es una biblioteca moderna que ayuda a Wagmi a formatear datos y preparar transacciones.

**Funciones útiles:**

- `formatUnits()` - Convierte números grandes de blockchain a decimales legibles
- `parseUnits()` - Convierte decimales a números grandes para la blockchain
- `isAddress()` - Verifica si una dirección es válida

**Ejemplo:**

```typescript
import { formatUnits } from "viem";

// Convierte 1000000000000000000 (wei) → "1.0" (ether)
const readable = formatUnits(bigBalance, 18);
```

#### 3. **RainbowKit v2** - La Cara Bonita

**¿Qué hace?** Crea los botones lindos para conectar wallets (MetaMask, WalletConnect, etc.).

**Características:**

- 🎨 Botones prediseñados y elegantes
- 🔐 Maneja la conexión de múltiples wallets
- 📱 Compatible con mobile
- 🌙 Soporte para modo oscuro

**Implementación:**

```typescript
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

<RainbowKitProvider>{children}</RainbowKitProvider>;
```

#### 4. **TanStack Query v5** - El Caché

**¿Qué hace?** Guarda los datos en memoria para que no tengamos que pedirlos a la blockchain todo el tiempo.

**Beneficios:**

- ⚡ Respuestas más rápidas
- 🔄 Actualización automática de datos
- 💾 Menos llamadas a la blockchain

---

### 🎯 Componentes Principales del DeFi

#### 1. **IssueRewards.tsx** - Emitir Recompensas

**¿Qué hace?** Permite al owner distribuir tokens REY a todos los stakers.

**Características:**

- 🔐 Solo el owner puede ejecutar esta acción
- 💰 Muestra el balance de REY disponible en el contrato
- ✅ Muestra notificaciones de éxito/error
- ⏳ Indicador de progreso mientras se procesa

**Flujo de uso:**

1. El usuario conecta su wallet
2. Si es el owner, puede ver el botón "Emitir Recompensas"
3. Hace clic y confirma la transacción en MetaMask
4. Espera la confirmación
5. Ve el mensaje de éxito

**Código clave:**

```typescript
const { writeContractAsync } = useWriteContract();

const handleIssue = async () => {
  await writeContractAsync({
    address: chefAddress,
    abi: MasterABI.abi,
    functionName: "issueTokens",
    args: [],
  });
};
```

#### 2. **TransferTokenFarm.tsx** - Stake y Unstake

**¿Qué hace?** Permite a los usuarios depositar (stake) y retirar (unstake) tokens DAMC.

**Características:**

- 📥 Botón para hacer staking
- 📤 Botón para retirar todo
- 💰 Muestra balance actual en staking
- ✅ Validaciones de montos

**Flujo de Staking:**

1. Usuario ingresa cantidad de DAMC
2. Aprueba al contrato MasterChef para usar sus tokens (approve)
3. Hace staking de los tokens
4. Ve su balance actualizado

**Flujo de Unstaking:**

1. Usuario hace clic en "Retirar Todo"
2. Confirma la transacción
3. Recibe de vuelta sus tokens DAMC

#### 3. **ClaimTestTokens.tsx** - Obtener Tokens de Prueba

**¿Qué hace?** Permite obtener tokens DAMC gratis para probar la app.

**Características:**

- 🎁 Envía tokens DAMC al usuario
- 🕐 Límite de tiempo entre reclamos
- 💰 Cantidad fija por reclamo

#### 4. **FundMasterChef.tsx** - Fondear el Contrato

**¿Qué hace?** Permite al owner enviar tokens REY al contrato MasterChef para que haya recompensas disponibles.

**Flujo:**

1. Owner ingresa cantidad de REY
2. Aprueba al contrato MasterChef
3. Transfiere los tokens REY
4. Ahora hay fondos para distribuir recompensas

---

## 🎨 Diseño y Estilo

### Tailwind CSS v3.4

Usamos **Tailwind** para todos los estilos, lo que permite:

- 🎨 Diseño responsive (funciona en mobile y desktop)
- ⚡ Estilos rápidos con clases utilitarias
- 🌙 Modo oscuro por defecto

**Configuración:**

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  plugins: [heroui()],
};
```

### HeroUI v2.8.5

Biblioteca de componentes React modernos y elegantes:

- `Button` - Botones con diferentes variantes
- `Card` - Tarjetas para contenido
- `Input` - Campos de texto
- `Progress` - Barras de progreso
- `Tooltip` - Información contextual

**Tema oscuro por defecto:**

```tsx
// layout.tsx
<html lang="es" className="dark">
  <body>{children}</body>
</html>
```

---

## 🚀 Cómo Ejecutar el Proyecto

### Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
# Crear apps/hardhat/.env y apps/frontend/.env.local

# 3. Compilar contratos
cd apps/hardhat
npm run compile

# 4. (Opcional) Ejecutar red local de Hardhat
npm run node

# 5. Desplegar contratos (local o Amoy)
npm run deploy:amoy

# 6. Ejecutar el frontend
cd ../frontend
npm run dev
```

Abrí tu navegador en `http://localhost:3000`

---

## 🔐 Seguridad y Buenas Prácticas

### En los Contratos:

- ✅ Uso de `require()` para validaciones
- ✅ Restricción de funciones críticas al owner
- ✅ Eventos para trackear todas las acciones importantes
- ✅ No hay funciones `selfdestruct` o vulnerabilidades conocidas

### En el Frontend:

- ✅ Validación de inputs antes de enviar transacciones
- ✅ Manejo de errores con mensajes claros
- ✅ Variables de entorno para datos sensibles
- ✅ No se guardan claves privadas en el código

---

## 📝 Scripts Disponibles

### Hardhat (apps/hardhat):

```bash
npm run compile      # Compilar contratos
npm run test         # Ejecutar tests
npm run node         # Iniciar red local
npm run deploy:local # Desplegar en red local
npm run deploy:amoy  # Desplegar en Polygon Amoy
npm run copy-abis    # Copiar ABIs al frontend
```

### Frontend (apps/frontend):

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Ejecutar build
npm run lint         # Linter de código
```

### Monorepo (raíz):

```bash
npm run build        # Compilar todo
npm run dev          # Ejecutar hardhat node + frontend
npm run test         # Ejecutar tests de hardhat
```

---

## 🤝 Conectar MetaMask a Polygon Amoy

### Paso 1: Agregar la Red

En MetaMask:

1. Clic en la red actual (arriba)
2. "Agregar red"
3. "Agregar red manualmente"

**Datos de Polygon Amoy:**

- **Nombre de red:** Polygon Amoy Testnet
- **RPC URL:** `https://rpc-amoy.polygon.technology`
- **Chain ID:** `80002`
- **Símbolo:** `MATIC`
- **Explorador:** `https://amoy.polygonscan.com/`

### Paso 2: Obtener MATIC de Prueba

1. Andá a un faucet: https://faucet.polygon.technology/
2. Ingresá tu dirección de wallet
3. Recibí tokens MATIC gratis

### Paso 3: Agregar los Tokens DAMC y REY

1. En MetaMask, "Importar tokens"
2. Pegá la dirección del contrato DAMC
3. Repetí con la dirección del contrato REY
4. Ahora podés ver tus balances

---

## 🎓 Conceptos Clave para Entender el Proyecto

### ¿Qué es un Contrato Inteligente?

Es como un programa que vive en la blockchain. Una vez desplegado, nadie puede cambiarlo ni apagarlo. Funciona 24/7 automáticamente.

### ¿Qué es un Token ERC-20?

Es un tipo de moneda digital que sigue un estándar. Como una moneda del Monopoly, pero digital y en blockchain.

### ¿Qué es Staking?

Es "depositar" tus tokens en un contrato. Es como poner tu dinero en un plazo fijo: lo guardás por un tiempo y recibís intereses.

### ¿Qué es un ABI?

Application Binary Interface. Es como un "diccionario" que le dice a tu app cómo hablar con el contrato. Sin el ABI, tu frontend no sabría qué funciones puede llamar.

### ¿Qué es un Signer?

Es tu cuenta de wallet que puede firmar transacciones. Como tu firma digital en cheques.

### ¿Qué es Gas?

Es la "nafta" que necesitás para que tu transacción se ejecute en la blockchain. En Polygon Amoy es casi gratis (tokens de prueba).

---

## 🐛 Solución de Problemas Comunes

### "Transaction Failed"

**Causa:** No tenés suficiente MATIC para pagar el gas.
**Solución:** Conseguí más MATIC del faucet.

### "Insufficient Allowance"

**Causa:** No aprobaste al contrato para usar tus tokens.
**Solución:** Primero ejecutá `approve()`, luego la transacción principal.

### "Only Owner Can Call"

**Causa:** Intentaste ejecutar una función de owner sin serlo.
**Solución:** Conectá la wallet del owner del contrato.

### "RPC Error"

**Causa:** Problemas de conexión con la blockchain.
**Solución:** Verificá que la URL del RPC sea correcta y que tengas internet.

---

## 📊 Flujo Completo de Uso

```
1. Usuario conecta MetaMask 🦊
   ↓
2. Obtiene tokens DAMC de prueba 🎁
   ↓
3. Aprueba al contrato MasterChef para usar DAMC ✅
   ↓
4. Hace staking de DAMC 📥
   ↓
5. Espera... ⏰
   ↓
6. Owner emite recompensas REY 👨‍🍳
   ↓
7. Usuario recibe tokens REY automáticamente 🎁
   ↓
8. Usuario puede unstakear sus DAMC cuando quiera 📤
```

---

## 🌟 Tecnologías Resumidas

| Capa                | Tecnología     | Versión | Propósito                  |
| ------------------- | -------------- | ------- | -------------------------- |
| **Blockchain**      | Polygon Amoy   | Testnet | Red de despliegue          |
| **Smart Contracts** | Solidity       | 0.8.4   | Lenguaje de contratos      |
| **Entorno Dev**     | Hardhat        | 2.27.0  | Compilación y despliegue   |
| **Web3 Lib**        | Ethers.js      | 6.15.0  | Interacción con blockchain |
| **Frontend**        | Next.js        | 16.0.1  | Framework React            |
| **UI Lib**          | React          | 19.2.0  | Biblioteca de componentes  |
| **Web3 React**      | Wagmi          | 2.19.2  | Hooks de blockchain        |
| **Wallet**          | RainbowKit     | 2.2.9   | Conexión de wallets        |
| **ABI Parser**      | Viem           | 2.38.6  | Utilidades Web3            |
| **Estilos**         | Tailwind CSS   | 3.4     | Framework CSS              |
| **Components**      | HeroUI         | 2.8.5   | Componentes React          |
| **Cache**           | TanStack Query | 5.90.7  | Estado y caché             |

---

## 📚 Recursos Adicionales

- [Documentación de Hardhat](https://hardhat.org/docs)
- [Documentación de Wagmi](https://wagmi.sh)
- [Documentación de RainbowKit](https://www.rainbowkit.com/)
- [Documentación de Viem](https://viem.sh)
- [Polygon Amoy Faucet](https://faucet.polygon.technology/)
- [Polygon Amoy Explorer](https://amoy.polygonscan.com/)
- [OpenZeppelin (Contratos Seguros)](https://docs.openzeppelin.com/)

---

## 🎉 Conclusión

Este proyecto es un ejemplo completo de una aplicación **DeFi real**. Aunque usa una red de prueba, la arquitectura y el código son exactamente iguales a lo que usarías en producción con dinero real.

**Has aprendido:**

- ✅ Cómo crear tokens ERC-20
- ✅ Cómo implementar un sistema de staking
- ✅ Cómo conectar un frontend React a la blockchain
- ✅ Cómo desplegar contratos en Polygon
- ✅ Cómo usar las mejores librerías Web3

**Próximos pasos sugeridos:**

1. Agregar tests unitarios en Hardhat
2. Implementar un sistema de APY (Annual Percentage Yield)
3. Agregar un dashboard con gráficos de estadísticas
4. Crear un sistema de timelock para rewards
5. Desplegar en mainnet de Polygon cuando esté listo

---

**¡Feliz staking! 🚀🎁**

_Proyecto creado con ❤️ por Ariel Duarte en 2025_
