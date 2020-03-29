export const notify = (target, verb) => {
    if (process.env.NODE_ENV === "development") {
        console.log(`[${target}] ${verb}`);
    }
};
