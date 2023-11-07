import { readdirSync, copyFileSync, existsSync, mkdirSync, renameSync} from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';
import { homedir } from 'os';
// import readlineSync from './node_modules/readline-sync/lib/readline-sync.js';
import readlineSync from 'readline-sync';

const desktopPath = join(homedir(), 'Desktop');
const testDownloadPath = join(desktopPath, 'test_download');
const changedFilesPath = join(desktopPath, 'changed_files', '1');

function listFilesAndFolders(basePath) {
  const items = readdirSync(basePath);

  console.log('Pliki i foldery w folderze:');
  items.forEach((item, index) => {
    console.log(`${index + 1}. ${item}`);
  });

  const choice = readlineSync.question('Wybierz plik/folder do kopiowania lub wpisz "exit": ');

  if (choice.toLowerCase() === 'exit') {
    return
  } 
    const selectedIndex = parseInt(choice) - 1;
    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= items.length) {
      console.log('Nieprawidłowy wybór.');
  } else {
    const selectedItem = items[selectedIndex];
    const selectedItemPath = join(basePath, selectedItem);

    if (existsSync(selectedItemPath)) {
      if (existsSync(changedFilesPath)) {
        mkdirSync(changedFilesPath, { recursive: true });
      }
  
      if (selectedItem.includes('.')) {
        const fileExtension = selectedItem.split('.').pop();
        const fileNameWithoutExtension = selectedItem.slice(0, -fileExtension.length - 1);
  
        const newFileName = `${fileNameWithoutExtension}1.${fileExtension}`;
        const newFilePath = join(changedFilesPath, newFileName);
  
        renameSync(selectedItemPath, newFilePath);
      } else {
        const newFolderPath = join(changedFilesPath, `${selectedItem}1`);
        //newFolderPath?
        mkdirSync(newFolderPath);
  
         moveContentsRecursively(selectedItemPath, newFolderPath);
         //sprawdzić renameSync()
    
      }
    } else {
      console.log('Plik lub folder nie istnieje.');
      }
    }
    listFilesAndFolders(basePath);
  }
    
  function moveContentsRecursively(src, dest) {
      const items = readdirSync(src);
    
      items.forEach((item) => {
        const srcItemPath = join(src, item);
        const destItemPath = join(dest, item);
    
        if (existsSync(srcItemPath)) {
          if (existsSync(destItemPath)) {
            console.log(`Plik/folder "${item}" już istnieje w miejscu docelowym. Pomijam.`);
          } else {
            if (item.includes('.')) {
              renameSync(srcItemPath, destItemPath);
            } else {
              mkdirSync(destItemPath);
              moveContentsRecursively(srcItemPath, destItemPath);
            }
          }
        }
      });
    }

listFilesAndFolders(testDownloadPath);
