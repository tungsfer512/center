import os

def convert(filename, dir):
    PCAP_PATH = f"$PWD/snorts/tools/uploads/{dir}/{filename}.pcap"
    CSV_DIR = f"$PWD/snorts/tools/csv/{dir}"
    
    os.system(f"bash $PWD/snorts/tools/pcap_to_csv/CICFlowMeters/CICFlowMeter-4.0/bin/CICFlowMeter {PCAP_PATH} {CSV_DIR}")
    
    return f"{dir}/{filename}_ISCX.csv"