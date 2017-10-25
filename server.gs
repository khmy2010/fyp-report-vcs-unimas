function doGet() {
  var output = HtmlService.createHtmlOutputFromFile('page');
  output.setTitle('FYP Report | Version Control');
  return output;
}

function processFile(form) {
  
  try {
    var repo_id = "0ByEbhsxr8UeAUEo2MkVSV3I0OXM",
        folder = DriveApp.getFolderById(repo_id),
        fyp = form.fyp,
        fyp_desc = form.description,
        file,
        name;
    
    //upload the file to Google Drive
    file = folder.createFile(fyp);
    
    //set file name
    name = generateFileName(folder);
    file.setName(name);
    file.setDescription(fyp_desc);
    
    return 'File ' + name + 
           ' has been committed to repo: ' +  '<a href=' + file.getUrl() + '>' + 'Direct Link</a>';
  }
  catch(error) { return error.toString(); }
  
  function generateFileName(folder) {
    var prefix = 'FYP-Backup-',
        date = new Date(),
        month = (date.getMonth() + 1),
        day = date.getDate(),
        year = date.getFullYear(),  
        name = '',
        files,
        file,
        test,
        count = 0;
    
    //file name: FYP-Backup-241017
    name = prefix + day + month + year;

    files = folder.getFiles();
    
    while(files.hasNext()) {
      file = files.next();
      if(file) { 
        test = file.getName();
        test = test.replace(/\s.*/gm, ''); //remove version number
        if (name == test) { ++count; } 
      }
    }
    
    if (count > 0) { name = name + ' (' + count + ')'; }
    
    return name;
  }
}

function getFiles() {
    var repo_id = "0ByEbhsxr8UeAUEo2MkVSV3I0OXM",
        folder = DriveApp.getFolderById(repo_id),
        files = folder.getFiles(),
        file,
        cr_date,
        ret = '<tbody>',
        desc = '',
        type,
        url = '';
  
  while(files.hasNext()) {
    file = files.next();
    if(file) {
      desc = file.getDescription();
      if (desc == '' || desc === null) { desc = 'No description available.'; }
      cr_date = file.getDateCreated();
      cr_date = cr_date.toDateString();
      
      switch (file.getMimeType()) {
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          type = '.docx';
          break;
        case 'application/pdf':
          type = '.pdf';
          break;
        default:
          type = 'file';
          break;
      }
      
      url = '<a href="' + file.getUrl() + '"target="_blank">' + 'Open </a>';
      
      ret += '<tr>' + 
             '<td>' + file.getName() + '</td>' +   
             '<td>' + cr_date + '</td>' + 
             '<td>' + url + '</td>' +  
             '<td>' + desc + '</td>' + 
             '<td>' + type + '</td>' +    
            '</tr>';
    }
  }
  ret += '</tbody>';
  
  return ret;
}
