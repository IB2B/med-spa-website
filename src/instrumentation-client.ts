import { initBotId } from "botid/client/core"

// Vercel BotID: an invisible check that bookings are sent by people, not bots (same setup as the
// TORCH site). It adds a proof to these requests; /api/booking/create verifies it with checkBotId().
// Locally (next dev) every request counts as human.
initBotId({
  protect: [{ path: "/api/booking/create", method: "POST" }],
})
