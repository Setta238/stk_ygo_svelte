try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modules: Record<string, any> = import.meta.glob("@ygo_duel/cards/*.ts", { eager: true });

  Object.keys(modules).forEach((component) => {
    if (modules[component].default) {
      console.log(component, ...modules[component].default());
    }
  });
} catch (error) {
  console.log("(´・ω・｀)");
  console.error(error);
}
