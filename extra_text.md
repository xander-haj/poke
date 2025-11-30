This is a quick fix. The build failed because the `TeamMember` type definition was updated to support detailed Move Data, but the initial state in `App.tsx` was still using old string arrays. Also, there were some unused imports left over.

Here are the corrected files to fix the build immediately.


*Fixes: `Type 'string' is not assignable to type 'MoveData'` errors.*



*Fixes: Unused `COMMON_MONS` and `BarChart3` variables.*



*Fixes: `'k' is declared but never read` error.*
*(The previous file used `k` as a key in the moves map, but typically `mv` (value) should be the key or the index if no unique ID. I've updated the map key to use `i` (index) explicitly and safely).*