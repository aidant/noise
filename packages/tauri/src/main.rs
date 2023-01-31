#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use mdns_sd;

#[tauri::command]
async fn get_bluos_url() -> String {
    let mdns = mdns_sd::ServiceDaemon::new().unwrap();
    let receiver = mdns.browse("_musc._tcp.local.").unwrap();

    loop {
        match receiver.recv_async().await.unwrap() {
            mdns_sd::ServiceEvent::ServiceResolved(info) => {
                mdns.shutdown().unwrap();

                return format!(
                    "http://{}:{}/",
                    info.get_addresses().iter().next().unwrap(),
                    info.get_port()
                );
            }
            _other_event => {}
        }
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_bluos_url])
        .run(tauri::generate_context!())
        .unwrap();
}
