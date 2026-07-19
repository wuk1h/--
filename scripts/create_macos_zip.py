from __future__ import annotations

import argparse
import os
import shutil
import time
import zipfile
from pathlib import Path


EXECUTABLE_NAMES = {
    "启动网站.command",
    "关闭网站.command",
    "local-server-arm64",
    "local-server-amd64",
}


def zip_timestamp(path: Path) -> tuple[int, int, int, int, int, int]:
    modified = time.localtime(path.stat().st_mtime)
    return (
        max(modified.tm_year, 1980),
        modified.tm_mon,
        modified.tm_mday,
        modified.tm_hour,
        modified.tm_min,
        modified.tm_sec,
    )


def make_info(name: str, path: Path, mode: int, is_directory: bool = False) -> zipfile.ZipInfo:
    if is_directory and not name.endswith("/"):
        name += "/"
    info = zipfile.ZipInfo(name, zip_timestamp(path))
    info.create_system = 3
    info.compress_type = zipfile.ZIP_DEFLATED
    info.external_attr = (mode & 0xFFFF) << 16
    if is_directory:
        info.external_attr |= 0x10
    return info


def create_archive(source: Path, destination: Path) -> None:
    source = source.resolve(strict=True)
    destination = destination.resolve()
    destination.parent.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(destination, "w", allowZip64=True) as archive:
        root_name = source.name
        archive.writestr(make_info(root_name, source, 0o40755, True), b"")

        for directory, directory_names, file_names in os.walk(source):
            directory_names.sort()
            file_names.sort()
            current = Path(directory)

            for directory_name in directory_names:
                child = current / directory_name
                relative = child.relative_to(source).as_posix()
                archive.writestr(
                    make_info(f"{root_name}/{relative}", child, 0o40755, True),
                    b"",
                )

            for file_name in file_names:
                child = current / file_name
                relative = child.relative_to(source).as_posix()
                mode = 0o100755 if file_name in EXECUTABLE_NAMES else 0o100644
                info = make_info(f"{root_name}/{relative}", child, mode)
                with child.open("rb") as input_file, archive.open(info, "w") as output_file:
                    shutil.copyfileobj(input_file, output_file, length=1024 * 1024)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()
    create_archive(args.source, args.destination)


if __name__ == "__main__":
    main()
