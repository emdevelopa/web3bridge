# Data Location in Solidity: Structs, Mappings, and Arrays

## Where Are They Stored?

**Structs**
When declared as state variables (outside functions), structs are stored in **storage** — on the blockchain permanently. When declared inside a function, they default to **memory** unless explicitly specified otherwise, meaning they exist temporarily during the function call.

**Arrays**
Like structs, arrays declared as state variables live in **storage**. When passed into or declared inside functions, you must explicitly specify either `memory` (temporary, off-chain during execution) or `storage` (a reference to the blockchain state).

**Mappings**
Mappings can **only** exist in **storage**. They are always state variables and cannot be created in memory or passed as function arguments (with very limited exceptions).

---

## How They Behave When Executed or Called

**Structs** in storage are persistent — any changes made to them update the blockchain state. In memory, they are temporary copies; changes do not affect the original state.

**Arrays** in storage persist between transactions. In memory, they are temporary and only live for the duration of the function call. Storage arrays support `.push()` and `.pop()`, while memory arrays have a fixed size defined at creation.

**Mappings** always reference storage directly. Accessing a key that was never set returns the default value for that type (e.g., `0` for `uint`, `false` for `bool`) rather than throwing an error.

---

## Why Don't You Need to Specify `memory` or `storage` for Mappings?

Mappings are **hardcoded to storage** by the Solidity compiler. There is no concept of a "memory mapping" because mappings work by computing a hash of the key to find a storage slot — this mechanism only makes sense in the context of persistent blockchain storage. Since they can only ever live in storage, specifying it would be redundant, so Solidity doesn't require (or allow) you to do so.