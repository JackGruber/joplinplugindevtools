// https://docs.github.com/en/rest/reference/repos

import * as fs from "fs-extra";
import { Octokit } from "@octokit/rest";

export interface AssetOptions {
  file: string;
  token: string;
  label: string;
  name: string;
  owner: string;
  repo: string;
  release_id: number;
}

export interface ReleaseOptions {
  name: string;
  owner: string;
  repo: string;
  tag: string;
  body: string;
  prerelease: boolean;
  token: string;
}

export interface ReproOptions {
  owner: string;
  repo: string;
  token?: string;
}

export async function checkAuth(options: ReproOptions): Promise<boolean> {
  const octokit = new Octokit({ auth: options.token });
  const response = await octokit.rest.users.getAuthenticated();

  if (response.status === 200) {
    return true;
  } else {
    return false;
  }
}

export async function githubRelease(options: ReleaseOptions): Promise<any> {
  const octokit = new Octokit({ auth: options.token });
  const response = await octokit.rest.repos.createRelease({
    owner: options.owner,
    repo: options.repo,
    tag_name: options.tag,
    body: options.body,
    prerelease: options.prerelease,
    name: options.name,
  });

  if (response.status !== 201) {
    console.error(response);
    throw new Error("github release error");
  }
  return response.data;
}

export async function githubAsset(asset: AssetOptions): Promise<any> {
  const octokit = new Octokit({ auth: asset.token });

  const response = await octokit.rest.repos.uploadReleaseAsset({
    owner: asset.owner,
    repo: asset.repo,
    release_id: asset.release_id,
    name: asset.name,
    label: asset.label,
    data: fs.readFileSync(asset.file),
  });

  if (response.status !== 201 && response.data.state !== "uploaded") {
    console.error(response);
    throw new Error("github asset upload error");
  }

  return response.data;
}
