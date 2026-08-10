export const demoCategories = [
  { id: 1, name: 'Entertainment', slug: 'entertainment', description: 'Streaming, media and entertainment apps.' },
  { id: 2, name: 'Tools', slug: 'tools', description: 'Useful Android utilities and productivity tools.' },
  { id: 3, name: 'Games', slug: 'games', description: 'Popular Android games and arcade titles.' },
  { id: 4, name: 'Photography', slug: 'photography', description: 'Photo, video and creative editing apps.' },
  { id: 5, name: 'Music', slug: 'music', description: 'Music players, audio tools and discovery apps.' },
  { id: 6, name: 'Communication', slug: 'communication', description: 'Messaging and communication apps.' }
];

export const demoApps = [
  {
    id: 1, title: 'TuneWave Premium', slug: 'tunewave-premium', short_description: 'A polished demo music player with offline playlists and premium-style controls.',
    developer: 'Wave Labs', version: '8.4.2', android_required: '8.0+', size: '84 MB', rating: 4.8, downloads: 1250000,
    category_id: 5, category: demoCategories[4], icon_url: '/demo/icons/tunewave.svg', featured_image: '/demo/screens/tunewave.svg',
    apk_url: '#demo-download', mod_info: 'Demo listing only • No third-party APK is bundled', status: 'published', featured: true, trending: true, app_type: 'app',
    features: ['Offline playlists', 'High quality audio', 'Clean premium interface', 'Sleep timer'],
    specifications: [{label:'Version',value:'8.4.2'},{label:'Android',value:'8.0+'},{label:'Size',value:'84 MB'},{label:'Developer',value:'Wave Labs'}],
    content_html: '<h2>About TuneWave</h2><p>TuneWave is a demo app listing included to show how your content pages will look. Replace it from the CMS with an app you are permitted to distribute.</p><h2>Key Features</h2><p>The page supports headings, paragraphs, tables, links and uploaded media from the CMS rich content editor.</p>',
    seo_title: 'TuneWave Premium APK - Latest Version', meta_description: 'Demo APK listing for the APKMarket CMS starter project.'
  },
  {
    id: 2, title: 'ClipForge Studio', slug: 'clipforge-studio', short_description: 'Fast mobile video editing with templates, transitions and export controls.',
    developer: 'Forge Creative', version: '5.2.1', android_required: '9.0+', size: '112 MB', rating: 4.7, downloads: 880000,
    category_id: 4, category: demoCategories[3], icon_url: '/demo/icons/clipforge.svg', featured_image: '/demo/screens/clipforge.svg', apk_url: '#demo-download',
    mod_info: 'Demo listing only', status: 'published', featured: true, trending: true, app_type: 'app',
    features: ['Timeline editor', 'Transitions', '1080p export', 'Templates'], specifications: [{label:'Version',value:'5.2.1'},{label:'Android',value:'9.0+'},{label:'Size',value:'112 MB'}],
    content_html: '<h2>Mobile editing made simple</h2><p>This sample listing demonstrates your website card and detail-page layouts.</p>', seo_title:'ClipForge Studio APK', meta_description:'Demo video editor listing.'
  },
  {
    id: 3, title: 'BlockQuest', slug: 'blockquest', short_description: 'A colourful sandbox adventure game built as sample content for your new website.',
    developer: 'Pixel Harbor', version: '2.9.0', android_required: '7.0+', size: '156 MB', rating: 4.9, downloads: 2140000,
    category_id: 3, category: demoCategories[2], icon_url: '/demo/icons/blockquest.svg', featured_image: '/demo/screens/blockquest.svg', apk_url:'#demo-download',
    mod_info:'Demo listing only', status:'published', featured:true, trending:true, app_type:'game', features:['Sandbox worlds','Creative mode','Offline play','Custom maps'], specifications:[{label:'Version',value:'2.9.0'},{label:'Android',value:'7.0+'},{label:'Size',value:'156 MB'}], content_html:'<h2>Explore BlockQuest</h2><p>A fictional game used to preview the Games section and download page design.</p>', seo_title:'BlockQuest APK', meta_description:'Demo sandbox game listing.'
  },
  {
    id: 4, title: 'ChatFlow Plus', slug: 'chatflow-plus', short_description: 'A clean messaging concept with private chats, groups and media sharing.',
    developer:'Flow Systems', version:'4.7.3', android_required:'8.0+', size:'66 MB', rating:4.6, downloads:620000,
    category_id:6, category:demoCategories[5], icon_url:'/demo/icons/chatflow.svg', featured_image:'/demo/screens/chatflow.svg', apk_url:'#demo-download', mod_info:'Demo listing only', status:'published', featured:false, trending:true, app_type:'app', features:['Group chats','Media sharing','Dark mode','Private conversations'], specifications:[{label:'Version',value:'4.7.3'},{label:'Size',value:'66 MB'}], content_html:'<h2>Simple communication</h2><p>ChatFlow Plus is fictional sample content.</p>', seo_title:'ChatFlow Plus APK', meta_description:'Demo messaging listing.'
  },
  {
    id: 5, title: 'VaultTools', slug: 'vaulttools', short_description: 'A compact toolbox for files, notes, QR utilities and device information.',
    developer:'Northstar Utilities', version:'3.1.8', android_required:'7.0+', size:'31 MB', rating:4.5, downloads:305000,
    category_id:2, category:demoCategories[1], icon_url:'/demo/icons/vaulttools.svg', featured_image:'/demo/screens/vaulttools.svg', apk_url:'#demo-download', mod_info:'Demo listing only', status:'published', featured:false, trending:false, app_type:'app', features:['File tools','QR scanner','Device info','Notes'], specifications:[{label:'Version',value:'3.1.8'},{label:'Size',value:'31 MB'}], content_html:'<h2>Everyday utilities</h2><p>Use this listing to preview the Tools category.</p>', seo_title:'VaultTools APK', meta_description:'Demo utility listing.'
  },
  {
    id: 6, title: 'StreamNest', slug: 'streamnest', short_description: 'A fictional entertainment hub for showcasing streaming-style app listings.',
    developer:'Nest Media', version:'10.0.4', android_required:'9.0+', size:'95 MB', rating:4.8, downloads:970000,
    category_id:1, category:demoCategories[0], icon_url:'/demo/icons/streamnest.svg', featured_image:'/demo/screens/streamnest.svg', apk_url:'#demo-download', mod_info:'Demo listing only', status:'published', featured:true, trending:false, app_type:'app', features:['Watchlists','Profiles','Recommendations','Offline library'], specifications:[{label:'Version',value:'10.0.4'},{label:'Size',value:'95 MB'}], content_html:'<h2>Your entertainment library</h2><p>StreamNest is fictional sample content for the homepage.</p>', seo_title:'StreamNest APK', meta_description:'Demo entertainment listing.'
  }
];

export const demoPages = {
  'about-us': { title: 'About Us', slug:'about-us', content_html:'<h2>About APKMarket</h2><p>APKMarket is a demo Android app directory starter. Replace this text in the CMS with your own company information.</p>' },
  'privacy-policy': { title:'Privacy Policy', slug:'privacy-policy', content_html:'<h2>Privacy Policy</h2><p>Add your final privacy policy here before launch.</p>' },
  'terms': { title:'Terms & Conditions', slug:'terms', content_html:'<h2>Terms & Conditions</h2><p>Add your final legal terms here before launch.</p>' },
  'dmca': { title:'DMCA / Copyright', slug:'dmca', content_html:'<h2>Copyright & Takedowns</h2><p>Provide a clear process for rights holders to report content.</p>' },
  'disclaimer': { title:'Disclaimer', slug:'disclaimer', content_html:'<h2>Disclaimer</h2><p>Only host or link to software you are authorised to distribute. Review files for security before publishing.</p>' }
};
