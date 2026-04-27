require("dotenv").config({ path: ".env.local" });

async function testModel(model) {
  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        prompt: "A simple futuristic crypto poster with a raven emblem, no text",
        size: "1024x1024",
        quality: "medium",
        n: 1,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(`❌ ${model} failed:`, data?.error?.message || data);
      return;
    }

    console.log(`✅ ${model} works`);
  } catch (err) {
    console.log(`❌ ${model} error:`, err.message);
  }
}

async function main() {
  await testModel("gpt-image-1");
  await testModel("gpt-image-1-mini");
  await testModel("gpt-image-2");
}

main();