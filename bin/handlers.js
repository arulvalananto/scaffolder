import chalk from "chalk";
import inquirer from "inquirer";
import { exec, execSync } from "child_process";
import fsExtra from "fs-extra";
import fs from "fs";

import questions from "./static/questions.js";
import spinner from "./static/spinners.js";
import packages from "./static/packages.js";

export const initHandler = async (argv) => {
  console.log(chalk.yellow.bold("🥚 Welcome to Boilers 🥚"));

  const { name } = await inquirer.prompt(questions.name);

  const { language } = await inquirer.prompt(questions.languages);
  const { features } = await inquirer.prompt(questions[language].features);
  const { confirm } = await inquirer.prompt(questions.confirm);

  if (confirm) {
    console.log(chalk.green.bold("✔ Initial setup done"));
    if (language === "react") {
      spinner.install.start();

      exec(`npx create-react-app ${name}`, (err) => {
        if (err) {
          console.error(err.message);
          process.exit(1);
        }
        spinner.install.succeed("📦 dependencies installed");

        spinner.features.start();
        features.map((feature) => {
          let command = `cd ${name} &&`;

          if (feature === "tailwind")
            command += `npm i ${packages[feature][0]} && ${packages[feature][1]}`;
          else command += ` npm i ${packages[feature]}`;

          execSync(command, (err) => {
            if (err) return console.error(err.message);
          });

          fs.cpSync(
            `../bin/templates/${language}/${feature}`,
            `${process.cwd()}/${name}`,
            { recursive: true },
            (err) => {
              if (err) return console.error(err.message);
            }
          );
        });
        spinner.features.succeed("ℹ️ features added");
      });
    } else if (language === "node") {
      console.log("🚧 under construction 🚧");
    }
  }
};

export const listHandler = () => {};
