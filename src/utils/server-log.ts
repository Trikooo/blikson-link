export function prettyServerLog(port: number) {
  const colors = {
    reset: "\x1B[0m",
    bright: "\x1B[1m",
    dim: "\x1B[2m",
    red: "\x1B[31m",
    green: "\x1B[32m",
    yellow: "\x1B[33m",
    blue: "\x1B[34m",
    magenta: "\x1B[35m",
    cyan: "\x1B[36m",
    white: "\x1B[37m",
    bgRed: "\x1B[41m",
    bgGreen: "\x1B[42m",
    bgYellow: "\x1B[43m",
    bgBlue: "\x1B[44m",
    bgMagenta: "\x1B[45m",
    bgCyan: "\x1B[46m",
  };

  const now = new Date();
  const timeString = now.toLocaleString(undefined, {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const serverInfo = `
${colors.dim}${colors.red}🔥 HONO API SERVER${colors.reset}
${colors.dim}${colors.yellow}──────────────────────────────────────────${colors.reset}
${colors.bright}${colors.cyan}📍 URL:${colors.reset} ${colors.yellow}${colors.bright}http://localhost:${port}${colors.reset}
${colors.dim}${colors.cyan}⚡️ Runtime:${colors.reset} ${colors.dim}${colors.magenta}Bun ${Bun.version}${colors.reset}
${colors.dim}${colors.cyan}🕐 Started:${colors.reset} ${colors.dim}${colors.white}${timeString}${colors.reset}
`;
  console.info(serverInfo);
}
