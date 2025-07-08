export function prettyServerLog(port: number) {
  const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
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
  console.log(serverInfo);

}
