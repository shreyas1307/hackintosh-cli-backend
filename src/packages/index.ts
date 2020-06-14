export const packagesList: packagesListType[] = [
    { name: "acidanthera/OpenCorePkg", endpoint: "github" },
    { name: "acidanthera/VirtualSMC", endpoint: "github" },
    { name: "acidanthera/Lilu", endpoint: "github" },
    { name: "acidanthera/WhateverGreen", endpoint: "github" },
    { name: "acidanthera/AppleALC", endpoint: "github" },
    { name: "acidanthera/IntelMausi", endpoint: "github" },
    { name: "khronokernel/SmallTree-I211-AT-patch", endpoint: "github" },
    { name: "Mieze/AtherosE2200Ethernet", endpoint: "github" },
    { name: "Mieze/RTL8111_driver_for_OS_X", endpoint: "github" },
    // {name: "Mieze/LucyRTL8125Ethernet", endpoint: "github"},
    { name: "Sniki/OS-X-USB-Inject-All", endpoint: "github" },
    { name: "RehabMan/os-x-usb-inject-all", endpoint: "bitbucket" },
    { name: "acidanthera/AirportBrcmFixup", endpoint: "github" },
    { name: "acidanthera/BrcmPatchRAM", endpoint: "github" },
    { name: "dortania/XLNCUSBFIX", endpoint: 'discord', download: "https://cdn.discordapp.com/attachments/566705665616117760/566728101292408877/XLNCUSBFix.kext.zip" },
    { name: "dortania/VoodooHDA", endpoint: 'discord', download: "https://cdn.discordapp.com/attachments/721596716754927630/721606554528514083/VoodooHDA.kext-292.zip" },
    { name: "RehabMan/VoodooTSCSync", endpoint: "bitbucket" },
    { name: "acidanthera/NVMeFix", endpoint: "github" },
    { name: "acidanthera/VoodooPS2", endpoint: "github" },
    { name: "VoodooI2C/VoodooI2C", endpoint: "github" },
    { name: "al3xtjames/NoTouchID", endpoint: "github" },
];

export type packagesListType = {
    name: string,
    endpoint: string,
    download?: string
}